'use client';

type TabsProps<T extends string> = {
  label: string;
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** 주면 탭 id(`{prefix}-tab-{value}`)와 aria-controls(선택 탭만, `{prefix}-panel-{value}`)를 붙인다. 패널은 쓰는 쪽이 같은 id로 만든다. */
  idPrefix?: string;
};

export function Tabs<T extends string>({ label, items, value, onChange, idPrefix }: TabsProps<T>) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  return (
    <div role="tablist" aria-label={label} className="relative flex w-full border-b border-[#e2e8f0]">
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          id={idPrefix && `${idPrefix}-tab-${item.value}`}
          aria-controls={idPrefix && item.value === value ? `${idPrefix}-panel-${item.value}` : undefined}
          aria-selected={item.value === value}
          tabIndex={index === activeIndex ? 0 : -1}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            // 탭 목록 안에서는 방향키로 옮긴다(WAI-ARIA tabs 패턴). 포커스는 선택된 탭에만 둔다.
            const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            if (!step) return;
            event.preventDefault();
            const next = (index + step + items.length) % items.length;
            onChange(items[next].value);
            (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
          }}
          className={`mx-[8px] mb-[12px] mt-[10px] flex-1 text-[17px] font-semibold leading-[1.5] ${item.value === value ? 'text-[#334155]' : 'text-[#94a3b8]'}`}
        >
          {item.label}
        </button>
      ))}
      <div
        aria-hidden="true"
        className="absolute bottom-[-1.5px] h-[2px] bg-[#266efb] transition-[left] duration-300 ease-in-out motion-reduce:transition-none"
        style={{ left: `${(activeIndex / items.length) * 100}%`, width: `${100 / items.length}%` }}
      />
    </div>
  );
}
