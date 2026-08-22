import { NextResponse, type NextRequest } from 'next/server';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { PreconditionFailedError, readJson, writeJson, writeJsonConditional } from '@/app/api/_lib/s3';
import {
  assignBannerIds,
  normalizePositions,
  privateDocSchema,
  publicDocSchema,
  saveBannersPayloadSchema,
  stampAudit,
  toPublicDoc,
  validateBannersUpdate,
  EMPTY_PRIVATE_DOC,
  type BannersResponse,
  type PrivateDoc,
} from '@/entities/banners';
import { DOC_CACHE_CONTROL, PRIVATE_KEY, PUBLIC_KEY } from '@/entities/banners/config';

export const dynamic = 'force-dynamic';

const badRequest = (message: string, issues: { path: string; message: string }[] = []) =>
  NextResponse.json({ message, issues }, { status: 400 });

const readPrivate = async () => {
  const result = await readJson<unknown>(PRIVATE_KEY);
  if (!result.data) return { doc: null, etag: result.etag, lastModified: result.lastModified };

  const parsed = privateDocSchema.safeParse(result.data);
  return { doc: parsed.success ? parsed.data : null, etag: result.etag, lastModified: result.lastModified };
};

/** private 가 단일 진실이라 백오피스는 이것만 읽는다. public 은 발행 결과일 뿐이다. */
export async function GET() {
  try {
    await authorize();
    const { doc, etag } = await readPrivate();
    const publicResult = await readJson<unknown>(PUBLIC_KEY);

    const body: BannersResponse = {
      doc: doc ?? EMPTY_PRIVATE_DOC,
      etag,
      publicLastModified: publicResult.lastModified,
    };

    return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * 발행. private 를 갱신하고 그 결과로 public 을 다시 만든다.
 *
 * 클라이언트가 GET 에서 받아 보관한 ETag 로 조건부 쓰기를 한다.
 * 412 가 오면 409 로 변환해 "다른 사람이 먼저 저장했습니다" 를 띄우게 한다.
 */
export async function PUT(request: NextRequest) {
  try {
    const { actor } = await authorize();

    const json = await request.json().catch(() => null);
    const parsed = saveBannersPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return badRequest(
        '입력값이 올바르지 않습니다.',
        parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      );
    }

    const now = new Date();
    const { etag, doc } = parsed.data;
    const previous = await readPrivate();

    const issues = validateBannersUpdate(previous.doc, doc, now);
    if (issues.length > 0) {
      return badRequest('저장할 수 없는 변경이 있습니다.', issues);
    }

    const nextPrivate: PrivateDoc = normalizePositions(
      stampAudit(assignBannerIds(doc), previous.doc, actor, now),
    );
    nextPrivate.publishedVersion = (previous.doc?.publishedVersion ?? 0) + 1;

    const privateCheck = privateDocSchema.safeParse(nextPrivate);
    if (!privateCheck.success) {
      return badRequest(
        'private 문서 검증에 실패했습니다.',
        privateCheck.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      );
    }

    const nextPublic = toPublicDoc(privateCheck.data, now);
    const publicCheck = publicDocSchema.safeParse(nextPublic);
    if (!publicCheck.success) {
      return badRequest(
        'public 문서 검증에 실패했습니다.',
        publicCheck.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      );
    }

    try {
      // private 를 먼저 쓴다. 반대로 하면 public 만 성공하고 private 가 실패했을 때,
      // 다음 발행이 낡은 private 로 public 을 덮어 앱 배너를 조용히 되돌린다.
      const nextEtag = await writeJsonConditional(PRIVATE_KEY, privateCheck.data, etag, DOC_CACHE_CONTROL);
      await writeJson(PUBLIC_KEY, JSON.stringify(publicCheck.data, null, 2), DOC_CACHE_CONTROL);

      const body: BannersResponse = {
        doc: privateCheck.data,
        etag: nextEtag,
        publicLastModified: now.toISOString(),
      };

      return NextResponse.json(body);
    } catch (error) {
      if (error instanceof PreconditionFailedError) {
        return NextResponse.json({ message: '다른 사람이 먼저 저장했습니다.' }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    return toErrorResponse(error);
  }
}
