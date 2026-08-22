import { NextResponse } from 'next/server';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { listVersions, readRaw } from '@/app/api/_lib/s3';
import { summarizePrivateDoc, type BannerVersion, type BannerVersionsResponse } from '@/entities/banners';
import { PRIVATE_KEY } from '@/entities/banners/config';

export const dynamic = 'force-dynamic';

/**
 * 최근 몇 개까지 내용을 읽어 요약을 붙일지.
 *
 * 되돌리기는 사실상 최근 몇 개 안에서 고르고, 버전당 GetObject 가 한 번씩 나가므로
 * 전부 읽으면 조회가 느려진다.
 */
const SUMMARY_LIMIT = 10;

/** private 버전만 보여준다. public 은 발행 결과라 단독으로 되돌릴 대상이 아니다. */
export async function GET() {
  try {
    await authorize();

    const now = new Date();
    const versions = await listVersions(PRIVATE_KEY);

    const summaries = await Promise.all(
      versions.slice(0, SUMMARY_LIMIT).map(async (version) => {
        const raw = await readRaw(PRIVATE_KEY, version.versionId).catch(() => null);
        if (raw === null) return null;
        try {
          return summarizePrivateDoc(JSON.parse(raw), now);
        } catch {
          // 과거 스키마·손상된 문서 하나가 이력 조회 전체를 깨뜨리면 안 된다.
          return null;
        }
      }),
    );

    const body: BannerVersionsResponse = {
      versions: versions.map(
        (version, index): BannerVersion => ({ ...version, summary: summaries[index] ?? null }),
      ),
    };

    return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
