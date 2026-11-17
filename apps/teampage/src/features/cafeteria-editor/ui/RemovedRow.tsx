'use client';
import { Button } from '@/shared/component/ds';
import type { FormMenu } from '../model/formValues';

export function RemovedRow({ item, onRestore }: { item: FormMenu; onRestore: () => void }) {
  return (
    <div className="flex items-center justify-between gap-[8px] bg-white py-[8px] pl-[16px] pr-[12px]">
      <span className="min-w-0 truncate text-[15px] font-semibold leading-[1.3] text-[#334155]">
        {item.source?.name || item.name} 삭제 예정
      </span>
      <Button variant="outlined" color="gray" onClick={onRestore}>
        되돌리기
      </Button>
    </div>
  );
}
