'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import DatePicker from 'react-datepicker';
import { offset } from '@floating-ui/react';
import Image from 'next/image';
import { BannerTimeInput } from './BannerTimeInput';
import 'react-datepicker/dist/react-datepicker.css';
import '@/shared/styles/datepicker.css';

type DateInputProps = InputHTMLAttributes<HTMLInputElement>;

const BannerDateTimeCustomInput = forwardRef<HTMLInputElement, DateInputProps>(function BannerDateTimeCustomInput(
  { className, onKeyDown, ...props },
  ref,
) {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        className={`w-[204px] py-[10px] pl-4 pr-11 rounded-lg border border-grey-300 bg-white outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m text-grey-900 placeholder:text-grey-500 disabled:cursor-not-allowed disabled:bg-grey-100 disabled:text-grey-600 ${className ?? ''}`}
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

const pad = (value: number) => String(value).padStart(2, '0');

/** `YYYY-MM-DDTHH:mm` 은 벽시계 문자열이라 로컬 시각으로 읽고 되돌린다. */
const parseKstLocal = (local: string) => {
  if (!local) return null;
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatKstLocal = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

interface BannerDateTimeFieldProps {
  /** `YYYY-MM-DDTHH:mm` — entities/banners 의 kstLocalToIso 가 읽는 형식 */
  value: string;
  onChange: (local: string) => void;
  disabled?: boolean;
  ariaLabel: string;
}

export function BannerDateTimeField({ value, onChange, disabled, ariaLabel }: BannerDateTimeFieldProps) {
  return (
    <DatePicker
      selected={parseKstLocal(value)}
      onChange={(date) => onChange(date ? formatKstLocal(date) : '')}
      /* 목록이 아니라 입력이다 — 1분 단위면 슬롯이 1440개가 되고, 팝오버가 그만큼 길어진다. */
      showTimeInput
      timeInputLabel="시각"
      customTimeInput={<BannerTimeInput />}
      dateFormat="yyyy.MM.dd HH:mm"
      placeholderText="년/월/일 시:분"
      disabled={disabled}
      customInput={<BannerDateTimeCustomInput aria-label={ariaLabel} />}
      calendarClassName="push-notification-datepicker-calendar"
      showPopperArrow={false}
      /* 폭을 고정한다. 열림/닫힘에 따라 행의 레이아웃이 변하지 않아야 한다.
         tab-loop·popper 를 흐름에서 빼내는 처리는 shared/styles/datepicker.css 에 있다. */
      wrapperClassName="w-[204px] shrink-0"
      popperPlacement="bottom-start"
      popperModifiers={[offset(8)]}
      popperClassName="z-[100]"
    />
  );
}
