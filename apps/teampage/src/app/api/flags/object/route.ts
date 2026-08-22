import { type NextRequest, NextResponse } from 'next/server';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { readRaw } from '@/app/api/_lib/s3';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/entities/flags/config';

export const dynamic = 'force-dynamic';

/**
 * S3 원본 다운로드.
 *
 * 요약으로 판단이 안 될 때(과거 스키마, 손상, 정밀 비교) 실제로 저장된 바이트를
 * 그대로 받아볼 수 있어야 한다. 되돌리기 전에 확인하는 용도라 versionId 를 받는다.
 */
export async function GET(request: NextRequest) {
  try {
    await authorize();

    const scope = request.nextUrl.searchParams.get('scope');
    const versionId = request.nextUrl.searchParams.get('versionId') ?? undefined;
    if (scope !== 'public' && scope !== 'private') {
      return NextResponse.json({ message: 'scope 는 public 또는 private 이어야 합니다.' }, { status: 400 });
    }

    const key = scope === 'public' ? PUBLIC_KEY : PRIVATE_KEY;
    const raw = await readRaw(key, versionId);
    if (raw === null) {
      return NextResponse.json({ message: '해당 버전을 찾을 수 없습니다.' }, { status: 404 });
    }

    const suffix = versionId ? `.${versionId.slice(0, 8)}` : '';
    return new NextResponse(raw, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${scope}${suffix}.json"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
