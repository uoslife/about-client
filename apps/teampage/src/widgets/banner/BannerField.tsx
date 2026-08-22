'use client';
import type { ReactNode } from 'react';
import { Text } from '@/shared/component/Text';

interface BannerFieldProps {
  label: string;
  required?: boolean;
  /** 라벨 우측 보조 표시 (잠김 배지 등) */
  aside?: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  htmlFor?: string;
  children: ReactNode;
}

/** 오류와 힌트는 같은 자리를 쓰고 오류가 이긴다. 둘 다 뜨면 레이아웃이 흔들린다. */
export function BannerField({ label, required, aside, hint, error, htmlFor, children }: BannerFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor={htmlFor} className="text-body-14-b text-grey-900">
          {label}
          {required && <span className="ml-1 text-danger-ui">*</span>}
        </label>
        {aside}
      </div>
      {children}
      {(error || hint) && (
        <Text variant="body-12-m" color={error ? 'danger-ui' : 'grey-600'} as="div">
          {error ?? hint}
        </Text>
      )}
    </div>
  );
}

export function BannerLockedBadge({ reason }: { reason: string }) {
  return (
    <span
      title={reason}
      className="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-[2px] text-body-12-m text-grey-600"
    >
      잠김
    </span>
  );
}

/** 목록 행·요약에 붙는 작은 칩. Tag 는 본문용이라 행에 쓰기엔 크다. */
export function BannerChip({ children, tone = 'grey' }: { children: ReactNode; tone?: 'grey' | 'danger' | 'primary' }) {
  const toneClass = {
    grey: 'bg-grey-100 text-grey-700',
    danger: 'bg-danger-lighter text-danger-ui',
    primary: 'bg-primary-lighter-alt text-primary-ui',
  }[tone];

  return <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-body-12-m ${toneClass}`}>{children}</span>;
}

export const bannerInputClass =
  'w-full rounded-lg border border-grey-300 px-4 py-[10px] text-body-16-m text-grey-900 outline-none transition-colors placeholder:text-grey-500 focus:border-primary-ui focus:ring-1 focus:ring-primary-ui';

export const bannerInputErrorClass =
  'w-full rounded-lg border border-danger-ui px-4 py-[10px] text-body-16-m text-grey-900 outline-none placeholder:text-grey-500 focus:ring-1 focus:ring-danger-ui';

export const bannerReadOnlyClass = `${bannerInputClass} cursor-not-allowed bg-grey-100 text-grey-600`;

export const bannerPrimaryButtonClass =
  'rounded-lg bg-primary-ui px-5 py-[10px] text-body-14-b text-white transition-colors hover:bg-primary-brand disabled:cursor-not-allowed disabled:opacity-40';

export const bannerGhostButtonClass =
  'rounded-lg border border-grey-300 bg-white px-4 py-[10px] text-body-14-b text-grey-700 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40';

export const bannerDangerButtonClass =
  'rounded-lg border border-danger-ui px-4 py-[10px] text-body-14-b text-danger-ui transition-colors hover:bg-danger-lighter disabled:cursor-not-allowed disabled:opacity-40';
