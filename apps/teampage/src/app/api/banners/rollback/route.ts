import { NextResponse, type NextRequest } from 'next/server';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { readJson, readRaw, writeJson } from '@/app/api/_lib/s3';
import { privateDocSchema, publicDocSchema, rollbackBannersPayloadSchema, toPublicDoc } from '@/entities/banners';
import { DOC_CACHE_CONTROL, PRIVATE_KEY, PUBLIC_KEY } from '@/entities/banners/config';

export const dynamic = 'force-dynamic';

/**
 * 지정한 private 버전의 내용을 읽어 다시 발행한다.
 *
 * 고르는 대상은 private 뿐이다. public 은 매 발행마다 private 에서 재생성되므로,
 * public 만 되돌리면 다음 발행에서 곧바로 덮여 사라진다.
 * 히스토리를 지우지 않고 새 버전을 얹는 방식이라 되돌리기도 되돌릴 수 있다.
 */
export async function POST(request: NextRequest) {
  try {
    await authorize();

    const json = await request.json().catch(() => null);
    const parsed = rollbackBannersPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: '입력값이 올바르지 않습니다.' }, { status: 400 });
    }

    const { versionId } = parsed.data;
    const raw = await readRaw(PRIVATE_KEY, versionId);
    if (!raw) {
      return NextResponse.json({ message: '해당 버전을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 되돌리려는 내용도 현재 스키마를 만족해야 한다.
    const check = privateDocSchema.safeParse(JSON.parse(raw));
    if (!check.success) {
      return NextResponse.json(
        { message: '해당 버전이 현재 스키마와 맞지 않아 되돌릴 수 없습니다.' },
        { status: 400 },
      );
    }

    // 발행 카운터는 되돌리지 않는다. 되감으면 exposure 로그의 version 이 서로 다른
    // 내용을 가리키게 된다.
    const current = await readJson<{ publishedVersion?: number }>(PRIVATE_KEY);
    const restored = { ...check.data, publishedVersion: (current.data?.publishedVersion ?? 0) + 1 };

    const now = new Date();
    const nextPublic = toPublicDoc(restored, now);
    const publicCheck = publicDocSchema.safeParse(nextPublic);
    if (!publicCheck.success) {
      return NextResponse.json({ message: 'public 문서 검증에 실패했습니다.' }, { status: 400 });
    }

    const etag = await writeJson(PRIVATE_KEY, JSON.stringify(restored, null, 2), DOC_CACHE_CONTROL);
    await writeJson(PUBLIC_KEY, JSON.stringify(publicCheck.data, null, 2), DOC_CACHE_CONTROL);

    return NextResponse.json({ versionId, etag });
  } catch (error) {
    return toErrorResponse(error);
  }
}
