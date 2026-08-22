import { NextResponse } from 'next/server';
import { summarizePrivate, summarizePublic, type FlagVersion, type FlagVersionsResponse } from '@/entities/flags';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { listVersions, readRaw } from '@/app/api/_lib/s3';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/entities/flags/config';

export const dynamic = 'force-dynamic';

/**
 * 최근 몇 개까지 내용을 읽어 요약을 붙일지.
 *
 * 되돌리기는 사실상 최근 몇 개 안에서 고르고, 버전당 GetObject 가 한 번씩 나가므로
 * 전부 읽으면 조회가 느려진다. 그보다 오래된 버전은 원본 다운로드로 확인한다.
 */
const SUMMARY_LIMIT = 10;

const withSummaries = async (
  key: string,
  versions: Omit<FlagVersion, 'summary'>[],
  summarize: (raw: unknown) => FlagVersion['summary'],
): Promise<FlagVersion[]> => {
  const summaries = await Promise.all(
    versions.slice(0, SUMMARY_LIMIT).map(async (version) => {
      const raw = await readRaw(key, version.versionId).catch(() => null);
      if (raw === null) return null;
      try {
        return summarize(JSON.parse(raw));
      } catch {
        // 과거 스키마·손상된 문서 하나가 이력 조회 전체를 깨뜨리면 안 된다.
        return null;
      }
    }),
  );

  return versions.map((version, index) => ({ ...version, summary: summaries[index] ?? null }));
};

/** S3 versioning 기반 이력 조회 */
export async function GET() {
  try {
    await authorize();

    const [publicVersions, privateVersions] = await Promise.all([listVersions(PUBLIC_KEY), listVersions(PRIVATE_KEY)]);
    const [publicWithSummary, privateWithSummary] = await Promise.all([
      withSummaries(PUBLIC_KEY, publicVersions, summarizePublic),
      withSummaries(PRIVATE_KEY, privateVersions, summarizePrivate),
    ]);

    const body: FlagVersionsResponse = { public: publicWithSummary, private: privateWithSummary };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
