'use client';
import { useState } from 'react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import type { BannerState } from '@/entities/banners';

interface BannerRowMenuProps {
  state: BannerState;
  onOpen: () => void;
  onClone: () => void;
  onTerminate: () => void;
  onDelete: () => void;
}

interface MenuItem {
  label: string;
  danger?: boolean;
  dividerBefore?: boolean;
  run: () => void;
}

export function BannerRowMenu({ state, onOpen, onClone, onTerminate, onDelete }: BannerRowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>({ callback: () => setIsOpen(false) });

  const items: MenuItem[] =
    state === 'ended'
      ? [
          { label: '상세 보기', run: onOpen },
          { label: '복제해서 새로 등록', run: onClone },
        ]
      : [
          { label: '수정', run: onOpen },
          { label: '복제', run: onClone },
          state === 'live'
            ? { label: '즉시 종료', danger: true, dividerBefore: true, run: onTerminate }
            : { label: '삭제', danger: true, dividerBefore: true, run: onDelete },
        ];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="배너 메뉴"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg px-2 py-1 text-body-16-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-grey-900"
      >
        ⋯
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[168px] rounded-xl border border-grey-200 bg-white py-1 shadow-[0px_0px_15px_0px_rgba(18,18,18,0.08)]">
          {items.map((item) => (
            <div key={item.label}>
              {item.dividerBefore && <div className="my-1 border-t border-grey-200" />}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  item.run();
                }}
                className={`block w-full px-4 py-2 text-left text-body-14-m transition-colors hover:bg-grey-50 ${
                  item.danger ? 'text-danger-ui' : 'text-grey-800'
                }`}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
