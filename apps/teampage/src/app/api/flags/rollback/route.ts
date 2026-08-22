import { NextResponse, type NextRequest } from 'next/server';
import { privateDocSchema, publicDocSchema, rollbackPayloadSchema } from '@/entities/flags';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { readRaw, writeJson } from '@/app/api/_lib/s3';
import { CACHE_CONTROL, PRIVATE_KEY, PUBLIC_KEY } from '@/entities/flags/config';

export const dynamic = 'force-dynamic';

/**
 * 지정한 S3 버전의 내용을 읽어 최신 버전으로 다시 쓴다(= 롤백).
 * 히스토리를 지우지 않고 새 버전을 얹는 방식이라 되돌리기도 되돌릴 수 있다.
 */
export async function POST(request: NextRequest) {
  try {
    await authorize();

    const json = await request.json().catch(() => null);
    const parsed = rollbackPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: '입력값이 올바르지 않습니다.' }, { status: 400 });
    }

    const { scope, versionId } = parsed.data;
    const key = scope === 'public' ? PUBLIC_KEY : PRIVATE_KEY;

    const raw = await readRaw(key, versionId);
    if (!raw) {
      return NextResponse.json({ message: '해당 버전을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 되돌리려는 내용도 현재 스키마를 만족해야 한다.
    const schema = scope === 'public' ? publicDocSchema : privateDocSchema;
    const check = schema.safeParse(JSON.parse(raw));
    if (!check.success) {
      return NextResponse.json({ message: '해당 버전이 현재 스키마와 맞지 않아 되돌릴 수 없습니다.' }, { status: 400 });
    }

    const etag = await writeJson(key, JSON.stringify(check.data, null, 2), CACHE_CONTROL);

    return NextResponse.json({ scope, versionId, etag });
  } catch (error) {
    return toErrorResponse(error);
  }
}
