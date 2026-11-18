'use client';
import { buttonClassName } from '@/shared/component/ds';
import { getCornerOptions } from '@/entities/cafeteria';
import type { CafeteriaFormEditor } from '../model/useCafeteriaForm';
import { CornerCard } from './CornerCard';
import { ExtraList } from './ExtraList';

export function CafeteriaForm({ editor }: { editor: CafeteriaFormEditor }) {
  const options = getCornerOptions(editor.form.loaded.name);
  const corners = editor.form.corners;
  const usesNamedCorners = options.length > 0 && corners.every((corner) => corner.corner !== null);
  const usedNames = new Set(corners.map((corner) => corner.corner));
  const unused = options.filter((option) => !usedNames.has(option));

  return (
    <div className="flex flex-col gap-[16px]">
      {corners.map((corner) => (
        <CornerCard
          key={corner.key}
          corner={corner}
          cornerChoices={usesNamedCorners && corner.corner ? [corner.corner, ...unused] : []}
          editor={editor}
        />
      ))}
      {usesNamedCorners && unused.length > 0 && (
        <select
          aria-label="코너 추가"
          value=""
          className={`${buttonClassName({ size: 's', variant: 'weak', color: 'gray', fullWidth: true })} cursor-pointer appearance-none text-center`}
          onChange={(event) => event.target.value && editor.dispatch({ type: 'addCorner', corner: event.target.value })}
        >
          <option value="">+ 코너 추가</option>
          {unused.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      <ExtraList lines={editor.form.extra} errors={editor.errors} dispatch={editor.dispatch} />
    </div>
  );
}
