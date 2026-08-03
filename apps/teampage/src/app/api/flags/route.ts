import { NextResponse, type NextRequest } from 'next/server';
import {
  privateDocSchema,
  publicDocSchema,
  savePayloadSchema,
  type FlagsResponse,
  type PrivateDoc,
  type PublicDoc,
} from '@/entities/flags';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { mergeDocs, toPrivateDoc, toPublicDoc } from '@/entities/flags';
import {
  PRIVATE_KEY,
  PUBLIC_KEY,
  PreconditionFailedError,
  readJson,
  writeJsonConditional,
} from './_lib/s3';

export const dynamic = 'force-dynamic';

const readBoth = async () => {
  const [publicResult, privateResult] = await Promise.all([
    readJson<PublicDoc>(PUBLIC_KEY),
    readJson<PrivateDoc>(PRIVATE_KEY),
  ]);
  return { publicResult, privateResult };
};

/** public + private 두 오브젝트를 읽어 합쳐서 반환. ETag를 함께 돌려준다. */
export async function GET() {
  try {
    await authorize();
    const { publicResult, privateResult } = await readBoth();

    const body: FlagsResponse = {
      bundle: mergeDocs(publicResult.data, privateResult.data),
      etags: { public: publicResult.etag, private: privateResult.etag },
      publicLastModified: publicResult.lastModified,
    };

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * 저장.
 * - mode: 'draft'   → private만 갱신
 * - mode: 'publish' → public + private 둘 다 갱신
 *
 * 클라이언트가 GET에서 받아 보관한 ETag로 조건부 쓰기를 한다.
 * 412가 오면 409로 변환해 "다른 사람이 먼저 저장했습니다"를 띄우게 한다.
 */
export async function PUT(request: NextRequest) {
  try {
    const { actor } = await authorize();

    const json = await request.json().catch(() => null);
    const parsed = savePayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: '입력값이 올바르지 않습니다.',
          issues: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
        },
        { status: 400 },
      );
    }

    const { mode, etags, bundle } = parsed.data;

    const { publicResult, privateResult } = await readBoth();
    const previousBundle = mergeDocs(publicResult.data, privateResult.data);

    const nextPrivate = toPrivateDoc(bundle, previousBundle, publicResult.data, actor, mode);
    const privateCheck = privateDocSchema.safeParse(nextPrivate);
    if (!privateCheck.success) {
      return NextResponse.json({ message: 'private 문서 검증에 실패했습니다.' }, { status: 400 });
    }

    let nextPublic: PublicDoc | null = null;
    if (mode === 'publish') {
      nextPublic = toPublicDoc(bundle, (publicResult.data?.version ?? 0) + 1);
      const publicCheck = publicDocSchema.safeParse(nextPublic);
      if (!publicCheck.success) {
        return NextResponse.json(
          {
            message: 'public 문서 검증에 실패했습니다.',
            issues: publicCheck.error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          },
          { status: 400 },
        );
      }
    }

    try {
      // public을 먼저 쓴다. 실패하면 private은 건드리지 않는다.
      const nextPublicEtag = nextPublic ? await writeJsonConditional(PUBLIC_KEY, nextPublic, etags.public) : etags.public;
      const nextPrivateEtag = await writeJsonConditional(PRIVATE_KEY, nextPrivate, etags.private);

      const body: FlagsResponse = {
        bundle: mergeDocs(nextPublic ?? publicResult.data, nextPrivate),
        etags: { public: nextPublicEtag, private: nextPrivateEtag },
        publicLastModified: nextPublic ? new Date().toISOString() : publicResult.lastModified,
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
