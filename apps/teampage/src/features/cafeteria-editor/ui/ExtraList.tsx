'use client';
import { Button, FieldLabel, HelpText, IconButton, TextField } from '@/shared/component/ds';
import { isLineChanged, type Line } from '../model/formValues';
import type { FormControls } from '../model/useCafeteriaForm';

export function ExtraList({ lines, errors, dispatch }: FormControls & { lines: Line[] }) {
  const sectionError = errors.get('extra');
  return (
    <div className="flex flex-col gap-[4px]">
      <FieldLabel>식당 공지</FieldLabel>
      {lines.map((line, index) => {
        const blank = line.value.trim() === '';
        const error = errors.get(line.key);
        return (
          <div key={line.key} className="flex items-start gap-[4px]">
            <TextField
              className="flex-1"
              srLabel={`공지 ${index + 1}`}
              placeholder="공지 입력"
              value={line.value}
              status={error ? 'error' : !blank && isLineChanged(line) ? 'success' : 'default'}
              helpText={error ?? (blank ? '반영 시 제외' : undefined)}
              onChange={(event) => dispatch({ type: 'updateExtra', lineKey: line.key, value: event.target.value })}
            />
            <IconButton
              icon="close"
              label={`공지 ${index + 1} 삭제`}
              className="mt-[4px]"
              onClick={() => dispatch({ type: 'removeExtra', lineKey: line.key })}
            />
          </div>
        );
      })}
      {sectionError && <HelpText status="error">{sectionError}</HelpText>}
      <div>
        <Button variant="text" color="blue" icon="add" className="!pl-0" onClick={() => dispatch({ type: 'addExtra' })}>
          공지 추가
        </Button>
      </div>
    </div>
  );
}
