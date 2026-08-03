/** 퍼센트(소수 2자리까지) → 버킷 수. 100% = 10000 버킷 */
export const KST_OFFSET = '+09:00';

/** `YYYY-MM-DD` (+ 선택적 시각) → KST 오프셋이 붙은 ISO 8601 문자열 */
export const ymdToKstIso = (ymd: string, time = '00:00:00') => `${ymd}T${time}${KST_OFFSET}`;

/** 오프셋이 붙은 ISO 문자열 → KST 기준 `YYYY-MM-DD` */
export const isoToKstYmd = (iso: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
};

export const formatKstDateTime = (iso: string) => {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 10)} ${kst.toISOString().slice(11, 16)} (KST)`;
};

/* ------------------------------------------------------------------ */
/* 분석용 SQL 스니펫                                                      */
/* ------------------------------------------------------------------ */
