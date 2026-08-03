import { TOTAL_BUCKETS, type MergedExperiment, type Variant } from '../model';
import { formatRange } from './range';

/** 퍼센트(소수 2자리까지) → 버킷 수. 100% = 10000 버킷 */
export interface RangeDiff {
  key: string;
  before: [number, number] | null;
  after: [number, number] | null;
}

/**
 * 실행 중인 실험의 구간이 바뀌었을 때 재배정되는 유저 비율.
 * 변경된 구간(대칭 차집합)의 폭 / 10000 으로 근사한다.
 */
export const estimateReassignedRatio = (before: Variant[], after: Variant[]) => {
  const occupancy = (variants: Variant[]) => {
    const map = new Map<number, string>();
    variants.forEach((variant) => {
      for (let bucket = variant.range[0]; bucket < variant.range[1]; bucket += 1) {
        map.set(bucket, variant.key);
      }
    });
    return map;
  };

  const beforeMap = occupancy(before);
  const afterMap = occupancy(after);
  let changed = 0;
  for (let bucket = 0; bucket < TOTAL_BUCKETS; bucket += 1) {
    if (beforeMap.get(bucket) !== afterMap.get(bucket)) changed += 1;
  }
  return changed / TOTAL_BUCKETS;
};

export const diffRanges = (before: Variant[], after: Variant[]): RangeDiff[] => {
  const keys = Array.from(new Set([...before.map((v) => v.key), ...after.map((v) => v.key)]));
  return keys
    .map((key) => ({
      key,
      before: before.find((v) => v.key === key)?.range ?? null,
      after: after.find((v) => v.key === key)?.range ?? null,
    }))
    .filter((diff) => JSON.stringify(diff.before) !== JSON.stringify(diff.after));
};

export interface ExperimentDiffLine {
  label: string;
  before: string;
  after: string;
}

const describeVariants = (variants: Variant[]) =>
  variants.map((variant) => `${variant.key} ${formatRange(variant.range)}`).join(', ');

export const diffExperiment = (
  before: MergedExperiment | undefined,
  after: MergedExperiment,
): ExperimentDiffLine[] => {
  const lines: ExperimentDiffLine[] = [];
  const push = (label: string, beforeValue: string, afterValue: string) => {
    if (beforeValue !== afterValue) lines.push({ label, before: beforeValue, after: afterValue });
  };

  push('캠페인명', before?.campaignName ?? '(신규)', after.campaignName);
  push('상태', before?.status ?? '(신규)', after.status);
  push('시작', before?.startAt ?? '(신규)', after.startAt);
  push('종료', before?.endAt ?? '(신규)', after.endAt);
  push('담당자', before?.owner ?? '', after.owner);
  push('구간', before ? describeVariants(before.variants) : '(신규)', describeVariants(after.variants));
  push('초안 여부', String(before?.isDraft ?? true), String(after.isDraft));

  return lines;
};
