'use client';
import { Button, SelectField } from '@/shared/component/ds';
import type { FormCorner } from '../model/formValues';
import type { CafeteriaFormEditor } from '../model/useCafeteriaForm';
import { Divider, MenuSection } from './MenuSection';

type CornerCardProps = {
  corner: FormCorner;
  /** 이 코너가 고를 수 있는 코너명(지금 값 + 다른 코너가 안 쓰는 것). 빈 배열이면 드롭다운을 안 보인다. */
  cornerChoices: string[];
  editor: CafeteriaFormEditor;
};

export function CornerCard({ corner, cornerChoices, editor }: CornerCardProps) {
  const hasLiveItems = [...corner.main, ...corner.sub].some((item) => !item.removed);
  const cornerError = editor.errors.get(corner.key);
  const cafeteriaName = editor.form.loaded.name;

  return (
    <div className="flex flex-col gap-[4px]">
      {hasLiveItems && (
        <div className="flex justify-end">
          <Button
            variant="text"
            color="red"
            aria-label={`${corner.corner ?? cafeteriaName} 메뉴 전체 삭제`}
            onClick={() => editor.dispatch({ type: 'removeCornerItems', cornerKey: corner.key })}
          >
            메뉴 삭제
          </Button>
        </div>
      )}
      <div className="overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]">
        {corner.corner !== null && cornerChoices.length > 0 && (
          <div className="bg-[#f8fafc] px-[16px] py-[10px]">
            <SelectField
              className="max-w-[200px]"
              label="코너"
              value={corner.corner}
              options={cornerChoices.map((choice) => ({ value: choice, label: choice }))}
              onChange={(event) =>
                editor.dispatch({ type: 'setCorner', cornerKey: corner.key, corner: event.target.value })
              }
            />
            {cornerError && <p className="ml-[4px] mt-[4px] text-[12px] font-medium text-[#ef4444]">{cornerError}</p>}
          </div>
        )}
        <MenuSection corner={corner} role="MAIN" editor={editor} />
        <Divider />
        <MenuSection corner={corner} role="SUB" editor={editor} />
      </div>
    </div>
  );
}
