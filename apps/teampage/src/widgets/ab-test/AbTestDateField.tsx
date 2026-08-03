'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import DatePicker from 'react-datepicker';
import { offset } from '@floating-ui/react';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import '@/shared/styles/datepicker.css';

type DateInputProps = InputHTMLAttributes<HTMLInputElement>;

const AbTestDateCustomInput = forwardRef<HTMLInputElement, DateInputProps>(function AbTestDateCustomInput(
  { className, onKeyDown, ...props },
  ref,
) {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        className={`w-[168px] pl-4 pr-11 py-[10px] border border-grey-300 rounded-lg bg-white outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m text-grey-900 placeholder:text-grey-500 ${className ?? ''}`}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (e.key.length === 1) e.preventDefault();
        }}
        {...props}
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
        aria-hidden
      >
        <Image src="/svg/calendar.svg" alt="" width={24} height={24} />
      </span>
    </div>
  );
});

const parseYmdToLocalNoon = (ymd: string) => new Date(`${ymd}T12:00:00`);

const formatYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface AbTestDateFieldProps {
  /** `YYYY-MM-DD` */
  value: string;
  onChange: (ymd: string) => void;
}

export function AbTestDateField({ value, onChange }: AbTestDateFieldProps) {
  return (
    <DatePicker
      selected={value ? parseYmdToLocalNoon(value) : null}
      onChange={(date) => onChange(date ? formatYmd(date) : '')}
      dateFormat="yyyy.MM.dd"
      placeholderText="년/월/일"
      customInput={<AbTestDateCustomInput />}
      calendarClassName="push-notification-datepicker-calendar"
      showPopperArrow={false}
      /* 폭을 고정한다. 열림/닫힘에 따라 행의 레이아웃이 변하지 않아야 한다.
         tab-loop·popper 를 흐름에서 빼내는 처리는 shared/styles/datepicker.css 에 있다. */
      wrapperClassName="w-[168px] shrink-0"
      popperPlacement="bottom-start"
      popperModifiers={[offset(8)]}
      popperClassName="z-[100]"
    />
  );
}
