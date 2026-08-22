'use client';
import { AnimatePresence, motion } from 'motion/react';
import { Text } from '@/shared/component/Text';
import { UNKNOWN_VALUE, variableEntries, type BannerVariable, type DraftPrivateDoc } from '@/entities/banners';
import { BannerChoiceGroup } from './BannerChoiceGroup';
import { bannerGhostButtonClass, bannerInputClass } from './BannerField';
import { useBannerMotion } from './bannerMotion';

export interface ConditionRow {
  variableKey: string;
  values: string[];
}

interface BannerConditionEditorProps {
  doc: DraftPrivateDoc;
  rows: ConditionRow[];
  readOnly: boolean;
  onChange: (rows: ConditionRow[]) => void;
}

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

/**
 * 조건 한 줄 = 변수 하나. 같은 변수를 두 줄에 걸면 어느 쪽이 이기는지 문서에
 * 표현할 수 없어(조건은 변수 키 하나당 배열 하나) 이미 쓴 변수는 고를 수 없다.
 */
export function BannerConditionEditor({ doc, rows, readOnly, onChange }: BannerConditionEditorProps) {
  const anim = useBannerMotion();
  const all = variableEntries(doc);
  const used = new Set(rows.map((row) => row.variableKey));
  const remaining = all.filter(([key]) => !used.has(key));

  const update = (index: number, next: ConditionRow) =>
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? next : row)));

  return (
    <div className="flex flex-col gap-3">
      {all.length === 0 && (
        <Text variant="body-12-m" color="grey-600">
          등록된 변수가 없습니다. 변수 관리에서 먼저 변수를 만들어주세요.
        </Text>
      )}

      {/* 변수를 바꾸면 key 가 갈려 행이 새로 붙는다. popLayout 이 나가는 행을 흐름에서
          빼야 그 자리에서 교차 전환으로 보인다. */}
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((row, index) => {
          const variable: BannerVariable | undefined = doc.variables[row.variableKey];
          const options = all.filter(([key]) => key === row.variableKey || !used.has(key));

          return (
            <motion.div
              key={row.variableKey || `row-${index}`}
              variants={anim.row}
              initial="hidden"
              animate="visible"
              exit="gone"
              transition={anim.transition}
              className="rounded-xl border border-grey-200 p-4"
            >
              <div className="flex items-center gap-2">
                <select
                  value={row.variableKey}
                  disabled={readOnly}
                  onChange={(event) => update(index, { variableKey: event.target.value, values: [] })}
                  className={`${bannerInputClass} max-w-[220px]`}
                >
                  <option value="">변수 선택</option>
                  {options.map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {!readOnly && (
                  <button
                    type="button"
                    aria-label="조건 삭제"
                    onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}
                    className="rounded px-2 py-1 text-body-14-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-danger-ui"
                  >
                    ✕
                  </button>
                )}
              </div>

              {variable && (
                <>
                  <div className="mt-3">
                    <BannerChoiceGroup
                      mode="multiple"
                      label={`${variable.label} 조건 값`}
                      values={row.values}
                      disabled={readOnly}
                      options={[
                        ...variable.values.map((value) => ({ value: value.key, label: value.label })),
                        { value: UNKNOWN_VALUE, label: '값 미상', reserved: true },
                      ]}
                      onChange={(value) => update(index, { ...row, values: toggle(row.values, value) })}
                    />
                  </div>
                  {variable.unknownNote && (
                    <Text variant="body-12-m" color="grey-600" className="mt-2">
                      값 미상: {variable.unknownNote}
                    </Text>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {!readOnly && (
        <button
          type="button"
          disabled={remaining.length === 0}
          onClick={() => onChange([...rows, { variableKey: remaining[0]?.[0] ?? '', values: [] }])}
          className={`${bannerGhostButtonClass} w-fit`}
        >
          ＋ 조건 추가
        </button>
      )}
    </div>
  );
}
