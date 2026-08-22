'use client';
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Text } from '@/shared/component/Text';
import {
  BANNER_END_KIND_LABEL,
  bannerImageUrl,
  describeCondition,
  effectiveEnd,
  endKind,
  formatKstRangeParts,
  type Banner,
  type BannerState,
  type BannerVariable,
} from '@/entities/banners';
import { BannerChip } from './BannerField';
import { BannerRowMenu } from './BannerRowMenu';
import { useBannerMotion } from './bannerMotion';

export interface BannerRowProps {
  id: string;
  banner: Banner;
  state: BannerState;
  placementName: string;
  variables: Record<string, BannerVariable>;
  /** 구좌 안의 노출 순서. 순서가 없는 섹션(예정·종료)은 null */
  orderNumber: number | null;
  isMoved: boolean;
  /** 정렬 가능한 행에만 붙는 손잡이. 없으면 자리도 만들지 않는다. */
  dragHandle?: ReactNode;
  isDragging?: boolean;
  /** DragOverlay 로 커서를 따라가는 사본 */
  isOverlay?: boolean;
  style?: CSSProperties;
  onOpen: () => void;
  onClone: () => void;
  onTerminate: () => void;
  onDelete: () => void;
}

/** 점 6개 그리드. 끌 수 있는 자리라는 신호는 아이콘이 준다. */
export const BannerDragHandle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function BannerDragHandle({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="끌어서 순서 변경"
        className={`shrink-0 cursor-grab touch-none rounded p-1 text-grey-400 outline-none transition-colors hover:bg-grey-100 hover:text-grey-600 focus-visible:ring-2 focus-visible:ring-primary-ui active:cursor-grabbing ${className ?? ''}`}
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden focusable="false">
          <circle cx="6" cy="4" r="1.4" />
          <circle cx="10" cy="4" r="1.4" />
          <circle cx="6" cy="8" r="1.4" />
          <circle cx="10" cy="8" r="1.4" />
          <circle cx="6" cy="12" r="1.4" />
          <circle cx="10" cy="12" r="1.4" />
        </svg>
      </button>
    );
  },
);

export const BannerRow = forwardRef<HTMLLIElement, BannerRowProps>(function BannerRow(
  {
    id,
    banner,
    state,
    placementName,
    variables,
    orderNumber,
    isMoved,
    dragHandle,
    isDragging,
    isOverlay,
    style,
    onOpen,
    onClone,
    onTerminate,
    onDelete,
  },
  ref,
) {
  const anim = useBannerMotion();
  // DragOverlay 사본은 motion 이 transform 을 인라인으로 잡으면 scale 강조가 사라진다.
  const presence = isOverlay
    ? {}
    : {
        variants: dragHandle ? anim.rowFade : anim.row,
        initial: 'hidden',
        animate: 'visible',
        exit: 'gone',
        transition: anim.transition,
      };
  const thumbnail = bannerImageUrl(banner.image.key);
  const conditions = Object.entries(banner.conditions);
  const period = formatKstRangeParts(banner.startAt, effectiveEnd(banner));

  return (
    <motion.li
      ref={ref}
      style={style}
      {...presence}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        isMoved ? 'border-primary-ui bg-primary-lighter-alt' : 'border-grey-200 bg-white'
      } ${isDragging ? '!opacity-40' : ''} ${
        isOverlay
          ? 'scale-[1.02] cursor-grabbing border-primary-ui shadow-[0_12px_32px_rgba(34,34,39,0.18)] motion-reduce:scale-100'
          : ''
      }`}
    >
      {dragHandle}
      {orderNumber !== null && (
        <Text variant="body-14-b" color="grey-600" as="span" className="w-4 shrink-0 text-center tabular-nums">
          {orderNumber}
        </Text>
      )}

      <div className="h-10 w-[72px] shrink-0 overflow-hidden rounded-md border border-grey-200 bg-grey-100">
        {thumbnail ? (
          // CDN 오리진이 환경 변수라 next/image 의 remotePatterns 로 고정할 수 없다.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-body-12-m text-grey-500">IMG</span>
        )}
      </div>

      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <Text variant="body-14-b" color="grey-900" as="span" className="block truncate">
          {banner.name}
        </Text>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <BannerChip>{placementName}</BannerChip>
          {conditions.map(([variableKey, values]) => (
            <BannerChip key={variableKey}>{describeCondition(variables[variableKey], values ?? [])}</BannerChip>
          ))}
          {state === 'ended' && <BannerChip tone="danger">{BANNER_END_KIND_LABEL[endKind(banner)]}</BannerChip>}
        </div>
      </button>

      {/* 칸을 고정한다. 같은 날이라 종료 날짜가 비어도 자리를 남겨야 행끼리 세로로 맞는다. */}
      <div className="grid shrink-0 grid-cols-[3rem_2.75rem_1.25rem_3rem_2.75rem] items-baseline gap-x-1 whitespace-nowrap text-right tabular-nums">
        <span className="text-body-14-b text-grey-900">{period.startDate}</span>
        <span className="text-body-14-m text-grey-600">{period.startTime}</span>
        <span className="text-body-14-m text-grey-400" aria-hidden>
          →
        </span>
        <span className="text-body-14-b text-grey-900">{period.endDate ?? ''}</span>
        <span className="text-body-14-m text-grey-600">{period.endTime}</span>
      </div>

      <BannerRowMenu
        key={id}
        state={state}
        onOpen={onOpen}
        onClone={onClone}
        onTerminate={onTerminate}
        onDelete={onDelete}
      />
    </motion.li>
  );
});
