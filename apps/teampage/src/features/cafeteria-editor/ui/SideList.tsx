'use client';
import { Button, FieldLabel, IconButton, TextField } from '@/shared/component/ds';
import { isLineChanged, type FormMenu, type Line } from '../model/formValues';
import type { FormControls } from '../model/useCafeteriaForm';

function SideRow({
  line,
  item,
  index,
  errors,
  dispatch,
}: FormControls & {
  line: Line;
  item: FormMenu;
  index: number;
}) {
  const error = errors.get(line.key);
  return (
    <div className="flex items-start gap-[4px]">
      <TextField
        className="flex-1"
        srLabel={`${item.name || '새 메뉴'} 사이드 ${index + 1}`}
        value={line.value}
        status={error ? 'error' : isLineChanged(line) ? 'success' : 'default'}
        helpText={error}
        onChange={(event) =>
          dispatch({ type: 'updateSide', itemKey: item.key, lineKey: line.key, value: event.target.value })
        }
      />
      <IconButton
        icon="close"
        label={`${line.value || '빈 사이드'} 삭제`}
        className="mt-[4px]"
        onClick={() => dispatch({ type: 'removeSide', itemKey: item.key, lineKey: line.key })}
      />
    </div>
  );
}

/** 메뉴 하나의 사이드 줄 목록과 "사이드 추가" 버튼. */
export function SideList({ item, errors, dispatch }: FormControls & { item: FormMenu }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <FieldLabel>사이드</FieldLabel>
      {item.sides.map((line, index) => (
        <SideRow key={line.key} line={line} item={item} index={index} errors={errors} dispatch={dispatch} />
      ))}
      <div>
        <Button
          variant="text"
          color="blue"
          icon="add"
          className="!pl-0"
          onClick={() => dispatch({ type: 'addSide', itemKey: item.key })}
        >
          사이드 추가
        </Button>
      </div>
    </div>
  );
}
