/**
 * 배너 일시는 분 단위 KST 다.
 *
 * flags 는 날짜(YYYY-MM-DD)만 다뤄 같은 헬퍼를 쓸 수 없다. entity 끼리는 서로
 * import 하지 않으므로 여기에 따로 둔다.
 */

export const KST_OFFSET = '+09:00';

const toKst = (iso: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

/** `YYYY-MM-DDTHH:mm` (datetime-local 값) → 오프셋이 붙은 ISO 8601 */
export const kstLocalToIso = (local: string) => (local ? `${local}:00${KST_OFFSET}` : '');

/** ISO 8601 → datetime-local 이 읽는 `YYYY-MM-DDTHH:mm` */
export const isoToKstLocal = (iso: string) => {
  const kst = toKst(iso);
  return kst ? kst.toISOString().slice(0, 16) : '';
};

export const formatKstDateTime = (iso: string) => {
  const kst = toKst(iso);
  if (!kst) return '-';
  const text = kst.toISOString();
  return `${text.slice(0, 10)} ${text.slice(11, 16)} (KST)`;
};

/** 지금을 그대로 저장 값으로 쓴다. `Z` 도 오프셋이라 스키마를 만족한다. */
export const nowIso = () => new Date().toISOString();

const kstParts = (iso: string) => {
  const kst = toKst(iso);
  if (!kst) return null;
  const text = kst.toISOString();
  return { date: `${text.slice(5, 7)}.${text.slice(8, 10)}`, time: text.slice(11, 16) };
};

export interface KstRangeParts {
  startDate: string;
  startTime: string;
  /** 시작과 같은 날이면 null. 목록에서 날짜를 두 번 읽히지 않게 한다. */
  endDate: string | null;
  endTime: string;
}

/** 목록용 기간 표기. 날짜와 시각을 나눠 돌려주고 위계는 행이 정한다. */
export const formatKstRangeParts = (startIso: string, endIso: string): KstRangeParts => {
  const start = kstParts(startIso);
  const end = kstParts(endIso);
  return {
    startDate: start?.date ?? '-',
    startTime: start?.time ?? '',
    endDate: end && start && end.date === start.date ? null : (end?.date ?? '-'),
    endTime: end?.time ?? '',
  };
};
