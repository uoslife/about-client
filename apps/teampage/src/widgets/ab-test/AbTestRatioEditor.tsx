'use client';
import { Text } from '@/shared/component/Text';
import { formatRange, sumPercent, unassignedPercent, type VariantDraft } from '@/entities/flags';
import type { Variant } from '@/entities/flags';

/**
 * 그룹 비율 편집기.
 *
 * 이전 구현은 숫자 input 이 든 표였다. 합이 100 을 넘는지, 어느 그룹이 얼마나
 * 큰지를 머릿속으로 계산해야 했다.
 *
 * 세 가지를 바꿨다.
 *  1. 막대로 먼저 보여준다 — 비율은 숫자보다 그림으로 판단하는 값이다.
 *  2. 프리셋과 "균등 배분" 을 둔다 — 실제로 쓰는 값은 50:50 이나 균등이 대부분이다.
 *  3. 미배정을 막대와 목록 양쪽에 명시한다 — 홀드아웃은 빠뜨린 게 아니라 의도다.
 */

const SEGMENT_COLORS = [
  'bg-primary-ui',
  'bg-[#7C9CF5]',
  'bg-[#9F7AEA]',
  'bg-[#38B2AC]',
  'bg-[#ED8936]',
  'bg-[#ED64A6]',
];

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * 입력 문자열 → 0~100 사이 값.
 *
 * 숫자와 소수점만 남기고, 소수점은 하나로 제한한다. 소수점 둘째 자리까지만
 * 의미가 있다(1% = 100 버킷, 0.01% = 1 버킷).
 */
const parsePercent = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const normalized = rest.length > 0 ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, round2(value));
};

interface AbTestRatioEditorProps {
  drafts: VariantDraft[];
  variants: Variant[];
  /** 생성 시에만 키 편집·행 추가/삭제를 허용한다 */
  editableKeys: boolean;
  onChange: (next: VariantDraft[]) => void;
  keyError?: string | null;
  percentError?: string | null;
}

export function AbTestRatioEditor({
  drafts,
  variants,
  editableKeys,
  onChange,
  keyError,
  percentError,
}: AbTestRatioEditorProps) {
  const total = sumPercent(drafts);
  const remaining = unassignedPercent(drafts);
  const over = total > 100;

  const patch = (index: number, next: Partial<VariantDraft>) =>
    onChange(drafts.map((draft, i) => (i === index ? { ...draft, ...next } : draft)));

  const distributeEvenly = () => {
    const each = round2(100 / drafts.length);
    onChange(
      drafts.map((draft, i) => ({
        ...draft,
        // 마지막 그룹이 나머지를 흡수해 합이 정확히 100 이 되게 한다.
        percent: i === drafts.length - 1 ? round2(100 - each * (drafts.length - 1)) : each,
      })),
    );
  };

  const fillRemainder = (index: number) =>
    patch(index, { percent: round2(drafts[index].percent + remaining) });

  return (
    <div className="flex flex-col gap-4">
      {/* 막대 — 비율을 숫자보다 먼저 보여준다 */}
      <div>
        <div className="flex h-9 w-full overflow-hidden rounded-lg bg-grey-100">
          {drafts.map((draft, index) => (
            <div
              key={`${draft.key}-${index}`}
              style={{ width: `${Math.max(0, Math.min(100, draft.percent))}%` }}
              className={`flex items-center justify-center transition-all ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
              title={`${draft.key || '(키 없음)'} ${draft.percent}%`}
            >
              {draft.percent >= 8 && (
                <span className="truncate px-1 text-body-12-m text-white">
                  {draft.key || '?'} {draft.percent}%
                </span>
              )}
            </div>
          ))}
          {remaining > 0 && (
            <div
              style={{ width: `${remaining}%` }}
              className="flex items-center justify-center"
              title={`미배정 ${remaining}%`}
            >
              {remaining >= 8 && <span className="px-1 text-body-12-m text-grey-600">미배정 {remaining}%</span>}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <Text variant="body-12-m" color={over ? 'danger-ui' : 'grey-600'}>
            합계 {total}% · 미배정 {remaining}%
          </Text>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={distributeEvenly}
              className="text-body-12-m text-primary-ui hover:underline"
            >
              균등 배분
            </button>
            {[
              { label: '50:50', values: [50, 50] },
              { label: '90:10', values: [90, 10] },
            ].map((preset) =>
              drafts.length === preset.values.length ? (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange(drafts.map((draft, i) => ({ ...draft, percent: preset.values[i] })))}
                  className="text-body-12-m text-primary-ui hover:underline"
                >
                  {preset.label}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>

      {/* 그룹 목록 */}
      <div className="flex flex-col gap-2">
        {drafts.map((draft, index) => (
          <div key={`${draft.key}-${index}`} className="flex items-center gap-3 max-md:flex-wrap">
            <span
              aria-hidden
              className={`h-3 w-3 shrink-0 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
            />
            <input
              type="text"
              value={draft.key}
              readOnly={!editableKeys}
              onChange={(event) => patch(index, { key: event.target.value })}
              placeholder="A"
              title={editableKeys ? undefined : '앱 코드와 짝이 맞아야 하는 값이라 만든 뒤에는 바꿀 수 없습니다.'}
              className={`w-[112px] shrink-0 rounded-lg border px-3 py-2 text-body-14-m outline-none ${
                editableKeys
                  ? 'border-grey-300 focus:border-primary-ui focus:ring-1 focus:ring-primary-ui'
                  : 'cursor-not-allowed border-grey-200 bg-grey-100 text-grey-600'
              }`}
            />

            <div className="flex w-[132px] shrink-0 items-center rounded-lg border border-grey-300 focus-within:border-primary-ui focus-within:ring-1 focus-within:ring-primary-ui">
              <input
                /**
                 * type="number" 를 쓰지 않는다.
                 *
                 * 숫자 input 에서 React 는 DOM 값과 prop 을 느슨하게 비교하므로
                 * ("080" == 80) 값을 되돌리지 않는다. 입력 중간 상태("1." "1e")를
                 * 깨뜨리지 않으려는 처리인데, 그 때문에 "080" 이 그대로 남는다.
                 * text 는 문자열로 엄격 비교되어 항상 정규화된 값이 표시된다.
                 */
                type="text"
                inputMode="decimal"
                value={String(draft.percent)}
                onChange={(event) => patch(index, { percent: parsePercent(event.target.value) })}
                className="w-full rounded-lg py-2 pl-3 pr-1 text-right text-body-14-m outline-none"
              />
              <span className="pr-3 text-body-14-m text-grey-600">%</span>
            </div>

            <Text variant="body-12-m" color="grey-600" as="span">
              {formatRange(variants[index]?.range ?? [0, 0])}
            </Text>

            <div className="ml-auto flex items-center gap-3">
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => fillRemainder(index)}
                  className="text-body-12-m text-primary-ui hover:underline"
                  title={`미배정 ${remaining}% 를 이 그룹에 더합니다`}
                >
                  나머지 채우기
                </button>
              )}
              {editableKeys && drafts.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange(drafts.filter((_, i) => i !== index))}
                  className="text-body-12-m text-danger-ui hover:underline"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}

        {/* 미배정은 항상 한 줄로 남긴다 */}
        <div className="flex items-center gap-3 border-t border-grey-200 pt-2">
          <span aria-hidden className="h-3 w-3 shrink-0 rounded-full border border-grey-300 bg-grey-100" />
          <Text variant="body-14-m" color="grey-700" as="span">
            미배정
          </Text>
          <Text variant="body-14-m" color={remaining < 0 ? 'danger-ui' : 'grey-600'} as="span">
            {remaining}%
          </Text>
          <Text variant="body-12-m" color="grey-500" as="span">
            실험에 포함되지 않고 기본 화면을 봅니다
          </Text>
        </div>
      </div>

      {(keyError || percentError) && (
        <Text variant="body-12-m" color="danger-ui">
          {percentError ?? keyError}
        </Text>
      )}

      {editableKeys && (
        <button
          type="button"
          onClick={() => onChange([...drafts, { key: '', percent: 0 }])}
          className="self-start text-body-14-m text-primary-ui hover:underline"
        >
          + 그룹 추가
        </button>
      )}
    </div>
  );
}
