'use client';
import { Text } from '@/shared/component/Text';
import { UNKNOWN_VALUE, variableEntries, type BannerVariable, type DraftPrivateDoc } from '@/entities/banners';
import { bannerGhostButtonClass, bannerInputClass } from './BannerField';

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

      {rows.map((row, index) => {
        const variable: BannerVariable | undefined = doc.variables[row.variableKey];
        const options = all.filter(([key]) => key === row.variableKey || !used.has(key));

        return (
          <div key={row.variableKey || `row-${index}`} className="rounded-xl border border-grey-200 p-4">
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
                <div className="mt-3 flex flex-wrap gap-3">
                  {[...variable.values.map((value) => ({ key: value.key, label: value.label })), {
                    key: UNKNOWN_VALUE,
                    label: '값 미상',
                  }].map((value) => (
                    <label key={value.key} className="flex items-center gap-2 text-body-14-m text-grey-800">
                      <input
                        type="checkbox"
                        disabled={readOnly}
                        checked={row.values.includes(value.key)}
                        onChange={() => update(index, { ...row, values: toggle(row.values, value.key) })}
                      />
                      {value.label}
                    </label>
                  ))}
                </div>
                {variable.unknownNote && (
                  <Text variant="body-12-m" color="grey-600" className="mt-2">
                    값 미상: {variable.unknownNote}
                  </Text>
                )}
              </>
            )}
          </div>
        );
      })}

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
