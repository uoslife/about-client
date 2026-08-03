import { TOTAL_BUCKETS, type Variant } from '../model';

/** 퍼센트(소수 2자리까지) → 버킷 수. 100% = 10000 버킷 */
export const percentToBuckets = (percent: number) => Math.round(percent * 100);

export const bucketsToPercent = (buckets: number) => Math.round((buckets / TOTAL_BUCKETS) * 10000) / 100;

export interface VariantDraft {
  key: string;
  percent: number;
}

/** 퍼센트 목록을 0부터 순서대로 이어붙인 반개구간 [시작, 끝)으로 변환한다. */
export const draftsToVariants = (drafts: VariantDraft[]): Variant[] => {
  let cursor = 0;
  return drafts.map((draft) => {
    const start = cursor;
    const end = Math.min(TOTAL_BUCKETS, start + percentToBuckets(draft.percent));
    cursor = end;
    return { key: draft.key, range: [start, end] as [number, number] };
  });
};

export const variantsToDrafts = (variants: Variant[]): VariantDraft[] =>
  variants.map((variant) => ({ key: variant.key, percent: bucketsToPercent(variant.range[1] - variant.range[0]) }));

export const sumPercent = (drafts: VariantDraft[]) =>
  Math.round(drafts.reduce((acc, draft) => acc + (Number.isFinite(draft.percent) ? draft.percent : 0), 0) * 100) / 100;

/** 미배정(홀드아웃) 비율. 100%에서 각 그룹 합을 뺀 나머지. */
export const unassignedPercent = (drafts: VariantDraft[]) => Math.round((100 - sumPercent(drafts)) * 100) / 100;

export const formatRange = (range: [number, number]) => `[${range[0]} – ${range[1]})`;

/* ------------------------------------------------------------------ */
/* KST 날짜 처리                                                         */
/* ------------------------------------------------------------------ */
