'use client';
import type { DragEvent } from 'react';
import { Text } from '@/shared/component/Text';
import {
  BANNER_END_KIND_LABEL,
  bannerImageUrl,
  describeCondition,
  effectiveEnd,
  endKind,
  formatKstShort,
  type Banner,
  type BannerState,
  type BannerVariable,
} from '@/entities/banners';
import { BannerChip } from './BannerField';
import { BannerRowMenu } from './BannerRowMenu';

interface BannerRowProps {
  id: string;
  banner: Banner;
  state: BannerState;
  placementName: string;
  variables: Record<string, BannerVariable>;
  /** 구좌 안의 노출 순서. 순서가 없는 섹션(예정·종료)은 null */
  orderNumber: number | null;
  /** 구좌 탭에서만 순서를 바꿀 수 있다. 전체 탭은 번호만 보여준다. */
  reorderable: boolean;
  isMoved: boolean;
  onOpen: () => void;
  onClone: () => void;
  onTerminate: () => void;
  onDelete: () => void;
  onMove?: (direction: -1 | 1) => void;
  onDragStart?: (event: DragEvent<HTMLLIElement>) => void;
  onDragOver?: (event: DragEvent<HTMLLIElement>) => void;
  onDrop?: (event: DragEvent<HTMLLIElement>) => void;
}

export function BannerRow({
  id,
  banner,
  state,
  placementName,
  variables,
  orderNumber,
  reorderable,
  isMoved,
  onOpen,
  onClone,
  onTerminate,
  onDelete,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
}: BannerRowProps) {
  const thumbnail = bannerImageUrl(banner.image.key);
  const conditions = Object.entries(banner.conditions);

  return (
    <li
      draggable={reorderable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        isMoved ? 'border-primary-ui bg-primary-lighter-alt' : 'border-grey-200 bg-white'
      }`}
    >
      {reorderable && (
        <span className="cursor-grab select-none text-grey-400" aria-hidden title="끌어서 순서 변경">
          ⠿
        </span>
      )}
      {orderNumber !== null && (
        <Text variant="body-14-b" color="grey-600" as="span" className="w-4 shrink-0 text-center">
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

      <Text variant="body-12-m" color="grey-600" as="span" className="shrink-0 whitespace-nowrap">
        {formatKstShort(banner.startAt)} → {formatKstShort(effectiveEnd(banner))}
      </Text>

      {reorderable && onMove && (
        <div className="flex shrink-0 flex-col">
          <button
            type="button"
            aria-label="위로 이동"
            onClick={() => onMove(-1)}
            className="rounded px-1 text-body-12-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-grey-900"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="아래로 이동"
            onClick={() => onMove(1)}
            className="rounded px-1 text-body-12-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-grey-900"
          >
            ↓
          </button>
        </div>
      )}

      <BannerRowMenu
        key={id}
        state={state}
        onOpen={onOpen}
        onClone={onClone}
        onTerminate={onTerminate}
        onDelete={onDelete}
      />
    </li>
  );
}
