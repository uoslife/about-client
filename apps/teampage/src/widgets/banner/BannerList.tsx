'use client';
import { useState, type DragEvent } from 'react';
import { Text } from '@/shared/component/Text';
import {
  BANNER_STATE_LABEL,
  allConditionalPlacements,
  formatKstDateTime,
  groupByState,
  moveInArray,
  placementEntries,
  type BannerEntry,
  type BannerState,
  type DraftPrivateDoc,
} from '@/entities/banners';
import { bannerGhostButtonClass, bannerPrimaryButtonClass } from './BannerField';
import { BannerRow } from './BannerRow';

/** `all` 이면 전체 구좌. 그 외에는 구좌 id. */
export const ALL_SCOPE = 'all';

interface BannerListProps {
  doc: DraftPrivateDoc;
  publicLastModified: string | null;
  now: Date;
  scope: string;
  onScopeChange: (scope: string) => void;
  /** 게시 중 배너의 편집 중 순서. 없으면 문서 순서 그대로 */
  order: string[] | null;
  onOrderChange: (ids: string[]) => void;
  onOrderReset: () => void;
  onOrderSave: () => void;
  isSaving: boolean;
  onCreate: () => void;
  onOpen: (id: string) => void;
  onClone: (id: string) => void;
  onTerminate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenPlacements: () => void;
  onOpenVariables: () => void;
  onOpenHistory: () => void;
}

export function BannerList({
  doc,
  publicLastModified,
  now,
  scope,
  onScopeChange,
  order,
  onOrderChange,
  onOrderReset,
  onOrderSave,
  isSaving,
  onCreate,
  onOpen,
  onClone,
  onTerminate,
  onDelete,
  onOpenPlacements,
  onOpenVariables,
  onOpenHistory,
}: BannerListProps) {
  const [isEndedOpen, setIsEndedOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const placements = placementEntries(doc);
  const scopedPlacement = scope === ALL_SCOPE ? null : scope;

  const entries: BannerEntry[] = Object.entries(doc.banners)
    .map(([id, banner]) => ({ id, banner }))
    .filter((entry) => !scopedPlacement || entry.banner.placement === scopedPlacement);

  const groups = groupByState(entries, now);
  const baseLiveIds = groups.live.map((entry) => entry.id);
  // 편집 중에도 시각이 흘러 예정 배너가 게시 중으로 넘어온다. 초안에 없는 배너를
  // 뒤에 붙이고 사라진 배너는 걸러야 목록에서 통째로 빠지지 않는다.
  const liveIds = order
    ? [...order.filter((id) => baseLiveIds.includes(id)), ...baseLiveIds.filter((id) => !order.includes(id))]
    : baseLiveIds;
  const live = liveIds.map((id) => groups.live.find((entry) => entry.id === id)).filter(Boolean) as BannerEntry[];

  const movedCount = liveIds.filter((id, index) => baseLiveIds[index] !== id).length;
  const isReorderable = Boolean(scopedPlacement);

  const warnedPlacements = allConditionalPlacements(doc, now).filter(
    (placementId) => !scopedPlacement || placementId === scopedPlacement,
  );

  /** 순서 번호는 구좌 안에서 셈한다. 전체 탭에서도 구좌별로 1부터다. */
  const orderNumberOf = (entry: BannerEntry) => {
    if (scopedPlacement) return live.findIndex((item) => item.id === entry.id) + 1;
    const sameLive = live.filter((item) => item.banner.placement === entry.banner.placement);
    return sameLive.findIndex((item) => item.id === entry.id) + 1;
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const next = moveInArray(liveIds, index, index + direction);
    if (next !== liveIds) onOrderChange(next);
  };

  const handleDrop = (event: DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    if (dragIndex === null) return;
    const next = moveInArray(liveIds, dragIndex, index);
    setDragIndex(null);
    if (next !== liveIds) onOrderChange(next);
  };

  const lastActor = Object.values(doc.banners)
    .slice()
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))[0]?.updatedBy;

  const renderRow = (entry: BannerEntry, state: BannerState, index: number) => (
    <BannerRow
      key={entry.id}
      id={entry.id}
      banner={entry.banner}
      state={state}
      placementName={doc.placements[entry.banner.placement]?.name ?? entry.banner.placement}
      variables={doc.variables}
      orderNumber={state === 'live' ? orderNumberOf(entry) : null}
      reorderable={state === 'live' && isReorderable}
      isMoved={state === 'live' && baseLiveIds[index] !== entry.id}
      onOpen={() => onOpen(entry.id)}
      onClone={() => onClone(entry.id)}
      onTerminate={() => onTerminate(entry.id)}
      onDelete={() => onDelete(entry.id)}
      onMove={state === 'live' && isReorderable ? (direction) => handleMove(index, direction) : undefined}
      onDragStart={state === 'live' && isReorderable ? () => setDragIndex(index) : undefined}
      onDragOver={state === 'live' && isReorderable ? (event) => event.preventDefault() : undefined}
      onDrop={state === 'live' && isReorderable ? (event) => handleDrop(event, index) : undefined}
    />
  );

  return (
    <div className={`mx-auto flex w-full max-w-[1120px] flex-col gap-5 ${movedCount > 0 ? 'pb-24' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="title-24-b" color="grey-900">
            배너 관리
          </Text>
          <Text variant="body-14-m" color="grey-600">
            앱 내에 노출되는 배너를 등록하고 관리합니다.
          </Text>
        </div>
        <button type="button" onClick={onCreate} disabled={placements.length === 0} className={bannerPrimaryButtonClass}>
          ＋ 배너 등록
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[{ id: ALL_SCOPE, name: '전체' }, ...placements.map(([id, placement]) => ({ id, name: placement.name }))].map(
            (tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onScopeChange(tab.id)}
                className={`rounded-full px-4 py-[6px] text-body-14-m transition-colors ${
                  scope === tab.id ? 'bg-grey-900 text-white' : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
                }`}
              >
                {tab.name}
              </button>
            ),
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenPlacements} className={bannerGhostButtonClass}>
            구좌 관리
          </button>
          <button type="button" onClick={onOpenVariables} className={bannerGhostButtonClass}>
            변수 관리
          </button>
        </div>
      </div>

      {warnedPlacements.map((placementId) => (
        <div key={placementId} className="rounded-xl border border-danger-ui bg-danger-lighter px-5 py-4">
          <Text variant="body-14-b" color="grey-900">
            ⚠ {doc.placements[placementId]?.name} 구좌는 게시 중인 배너가 모두 조건부입니다.
          </Text>
          <Text variant="body-12-m" color="grey-700">
            조건에 맞지 않는 사용자에게는 이 구좌가 비어 보입니다. 조건 없는 배너를 하나 남겨 두는 것을 권합니다.
          </Text>
        </div>
      ))}

      {placements.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-grey-200 bg-white px-6 py-10">
          <Text variant="body-16-b" color="grey-900">
            먼저 구좌를 만들어주세요.
          </Text>
          <Text variant="body-14-m" color="grey-600">
            배너 이미지의 권장 크기와 용량 제한이 구좌 정의에서 옵니다. 구좌가 없으면 이미지를 올릴 수 없습니다.
          </Text>
          <button type="button" onClick={onOpenPlacements} className={bannerPrimaryButtonClass}>
            구좌 만들기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <Text variant="body-16-b" color="grey-900">
              {BANNER_STATE_LABEL.live} {live.length}
            </Text>
            {live.length === 0 ? (
              <EmptySection message="게시 중인 배너가 없습니다." />
            ) : (
              <ul className="flex flex-col gap-2">{live.map((entry, index) => renderRow(entry, 'live', index))}</ul>
            )}
            {!isReorderable && live.length > 1 && (
              <Text variant="body-12-m" color="grey-600">
                순서는 구좌 탭에서 바꿀 수 있습니다.
              </Text>
            )}
          </section>

          {groups.scheduled.length > 0 && (
            <section className="flex flex-col gap-2">
              <Text variant="body-16-b" color="grey-900">
                {BANNER_STATE_LABEL.scheduled} {groups.scheduled.length}
              </Text>
              <ul className="flex flex-col gap-2">
                {groups.scheduled.map((entry, index) => renderRow(entry, 'scheduled', index))}
              </ul>
            </section>
          )}

          {groups.ended.length > 0 && (
            <section className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsEndedOpen((prev) => !prev)}
                className="flex w-fit items-center gap-2 rounded px-1 py-0.5 text-body-16-b text-grey-900 transition-colors hover:bg-grey-50"
              >
                <span aria-hidden>{isEndedOpen ? '▾' : '▸'}</span>
                {BANNER_STATE_LABEL.ended} {groups.ended.length}
              </button>
              {isEndedOpen && (
                <ul className="flex flex-col gap-2">
                  {groups.ended.map((entry, index) => renderRow(entry, 'ended', index))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 rounded-xl border border-grey-200 px-6 py-4">
        <div className="flex flex-col gap-1">
          <Text variant="body-14-m" color="grey-700">
            마지막 발행 {publicLastModified ? formatKstDateTime(publicLastModified) : '없음'}
            {lastActor ? ` · ${lastActor}` : ''}
          </Text>
          <Text variant="body-12-m" color="grey-600">
            문서 버전 v{doc.publishedVersion} · 전체 스위치 {doc.enabled ? 'ON' : 'OFF'}
          </Text>
        </div>
        <button type="button" onClick={onOpenHistory} className="text-body-14-m text-primary-ui hover:underline">
          발행 이력 →
        </button>
      </div>

      {movedCount > 0 && scopedPlacement && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-grey-200 bg-white">
          <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
            <Text variant="body-14-m" color="grey-700">
              {doc.placements[scopedPlacement]?.name} 순서 변경 {movedCount}건
            </Text>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onOrderReset} disabled={isSaving} className={bannerGhostButtonClass}>
                되돌리기
              </button>
              <button type="button" onClick={onOrderSave} disabled={isSaving} className={bannerPrimaryButtonClass}>
                {isSaving ? '저장 중' : '순서 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-grey-300 px-6 py-8 text-center">
      <Text variant="body-14-m" color="grey-500">
        {message}
      </Text>
    </div>
  );
}
