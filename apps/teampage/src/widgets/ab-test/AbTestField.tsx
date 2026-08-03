'use client';
import type { ReactNode } from 'react';
import { Text } from '@/shared/component/Text';

/**
 * 폼 필드 한 칸.
 *
 * 오류를 **입력 바로 아래**에 붙인다. 이전 구현은 모든 오류를 화면 하단에 한
 * 덩어리로 모아뒀는데, 폼이 길어지면 어느 필드가 문제인지 알 수 없었다.
 * 힌트와 오류는 같은 자리를 쓰고 오류가 있으면 오류가 이긴다 — 두 줄이 동시에
 * 뜨면 레이아웃이 흔들리고 무엇을 읽어야 할지 모호해진다.
 */
interface AbTestFieldProps {
  label: string;
  /** 라벨 우측 보조 표시 (예: 비공개 배지, 잠김 표시) */
  aside?: ReactNode;
  hint?: string;
  error?: string | null;
  htmlFor?: string;
  children: ReactNode;
}

export function AbTestField({ label, aside, hint, error, htmlFor, children }: AbTestFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor={htmlFor} className="text-body-14-b text-grey-900">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {(error || hint) && (
        <Text variant="body-12-m" color={error ? 'danger-ui' : 'grey-600'}>
          {error ?? hint}
        </Text>
      )}
    </div>
  );
}

/** 값이 왜 잠겼는지 라벨 옆에서 바로 알 수 있게 한다. */
export function AbTestLockedBadge({ reason }: { reason: string }) {
  return (
    <span
      title={reason}
      className="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-[2px] text-body-12-m text-grey-600"
    >
      잠김
    </span>
  );
}

/** 앱에 노출되지 않는 필드임을 표시한다. */
export function AbTestPrivateBadge() {
  return (
    <span
      title="비공개 파일에만 저장되며 앱에 내려가지 않습니다."
      className="inline-flex items-center rounded-full bg-grey-100 px-2 py-[2px] text-body-12-m text-grey-600"
    >
      비공개
    </span>
  );
}

export const fieldInputClass =
  'w-full rounded-lg border border-grey-300 px-4 py-[10px] text-body-16-m text-grey-900 outline-none transition-colors placeholder:text-grey-500 focus:border-primary-ui focus:ring-1 focus:ring-primary-ui';

export const fieldInputErrorClass =
  'w-full rounded-lg border border-danger-ui px-4 py-[10px] text-body-16-m text-grey-900 outline-none placeholder:text-grey-500 focus:ring-1 focus:ring-danger-ui';

export const fieldReadOnlyClass = `${fieldInputClass} cursor-not-allowed bg-grey-100 text-grey-600`;

/** 섹션 카드. 폼을 의미 단위로 끊어 스캔 가능하게 만든다. */
export function AbTestCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-grey-200 bg-white p-6 max-md:p-4">
      <div className="mb-5">
        <Text variant="body-18-b" color="grey-900">
          {title}
        </Text>
        {description && (
          <Text variant="body-12-m" color="grey-600">
            {description}
          </Text>
        )}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
