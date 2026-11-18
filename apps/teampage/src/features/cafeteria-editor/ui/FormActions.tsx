'use client';
import { Button } from '@/shared/component/ds';

type FormActionsProps = {
  dirty: boolean;
  canSave: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
};

export function FormActions({ dirty, canSave, saving, onReset, onSave }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-[8px]">
      <Button size="m" variant="outlined" color="gray" disabled={!dirty || saving} onClick={onReset}>
        되돌리기
      </Button>
      <Button size="m" variant="fill" color="blue" disabled={!canSave || saving} onClick={onSave}>
        반영
      </Button>
    </div>
  );
}
