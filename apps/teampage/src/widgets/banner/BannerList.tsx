'use client';
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'motion/react';
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
import { BannerRow, type BannerRowProps } from './BannerRow';
import { BannerSortableRow } from './BannerSortableRow';
import { useBannerMotion } from './bannerMotion';

/** `all` 이면 전체 구좌. 그 외에는 구좌 id. */

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
  const anim = useBannerMotion();
  const [isEndedOpen, setIsEndedOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 짧은 이동은 클릭으로 본다. 손잡이가 눌릴 때마다 드래그가 시작되면 포커스를 줄 수 없다.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const placements = placementEntries(doc);

  const entries: BannerEntry[] = Object.entries(doc.banners)
    .map(([id, banner]) => ({ id, banner }))
    .filter((entry) => entry.banner.placement === scope);

  const groups = groupByState(entries, now);
  const baseLiveIds = groups.live.map((entry) => entry.id);
  // 편집 중에도 시각이 흘러 예정 배너가 게시 중으로 넘어온다. 초안에 없는 배너를
  // 뒤에 붙이고 사라진 배너는 걸러야 목록에서 통째로 빠지지 않는다.
  const liveIds = order
    ? [...order.filter((id) => baseLiveIds.includes(id)), ...baseLiveIds.filter((id) => !order.includes(id))]
    : baseLiveIds;
  const live = liveIds.map((id) => groups.live.find((entry) => entry.id === id)).filter(Boolean) as BannerEntry[];

  const movedCount = liveIds.filter((id, index) => baseLiveIds[index] !== id).length;

  const warnedPlacements = allConditionalPlacements(doc, now).filter((placementId) => placementId === scope);

  const orderNumberOf = (entry: BannerEntry) => live.findIndex((item) => item.id === entry.id) + 1;

  // 게시 중이 한 개뿐인 구좌(다이얼로그 등)에는 순서라는 개념이 없다.
  const isOrdered = live.length > 1;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const next = moveInArray(liveIds, liveIds.indexOf(String(active.id)), liveIds.indexOf(String(over.id)));
    if (next !== liveIds) onOrderChange(next);
  };

  const lastActor = Object.values(doc.banners)
    .slice()
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))[0]?.updatedBy;

  const rowPropsOf = (entry: BannerEntry, state: BannerState, index: number): BannerRowProps => ({
    id: entry.id,
    banner: entry.banner,
    state,
    placementName: doc.placements[entry.banner.placement]?.name ?? entry.banner.placement,
    variables: doc.variables,
    orderNumber: state === 'live' && isOrdered ? orderNumberOf(entry) : null,
    isMoved: state === 'live' && baseLiveIds[index] !== entry.id,
    onOpen: () => onOpen(entry.id),
    onClone: () => onClone(entry.id),
    onTerminate: () => onTerminate(entry.id),
    onDelete: () => onDelete(entry.id),
  });

  const renderRow = (entry: BannerEntry, state: BannerState, index: number) => (
    <BannerRow key={entry.id} {...rowPropsOf(entry, state, index)} />
  );

  const activeIndex = activeId ? live.findIndex((entry) => entry.id === activeId) : -1;

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
          {placements.map(([id, placement]) => (
            <button
              key={id}
              type="button"
              onClick={() => onScopeChange(id)}
              className={`rounded-full px-4 py-[6px] text-body-14-m transition-colors ${
                scope === id ? 'bg-grey-900 text-white' : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
              }`}
            >
              {placement.name}
            </button>
          ))}
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
            ) : !isOrdered ? (
              <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>{live.map((entry, index) => renderRow(entry, 'live', index))}</AnimatePresence>
              </ul>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragStart={({ active }) => setActiveId(String(active.id))}
                onDragCancel={() => setActiveId(null)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={liveIds} strategy={verticalListSortingStrategy}>
                  <ul className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                      {live.map((entry, index) => (
                        <BannerSortableRow key={entry.id} {...rowPropsOf(entry, 'live', index)} />
                      ))}
                    </AnimatePresence>
                  </ul>
                </SortableContext>
                <DragOverlay>
                  {activeIndex >= 0 && (
                    <ul>
                      <BannerRow {...rowPropsOf(live[activeIndex], 'live', activeIndex)} isOverlay />
                    </ul>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </section>

          {groups.scheduled.length > 0 && (
            <section className="flex flex-col gap-2">
              <Text variant="body-16-b" color="grey-900">
                {BANNER_STATE_LABEL.scheduled} {groups.scheduled.length}
              </Text>
              <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {groups.scheduled.map((entry, index) => renderRow(entry, 'scheduled', index))}
                </AnimatePresence>
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
              {/* 이 화면에서 높이를 애니메이션하는 유일한 자리. 접힌 동안 행이 언마운트돼
                  숨은 버튼에 포커스가 가지 않는다. */}
              <AnimatePresence initial={false}>
                {isEndedOpen && (
                  <motion.div
                    variants={anim.collapse}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={anim.transition}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col gap-2">
                      <AnimatePresence initial={false}>
                        {groups.ended.map((entry, index) => renderRow(entry, 'ended', index))}
                      </AnimatePresence>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
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

      <AnimatePresence>
        {movedCount > 0 && (
          <motion.div
            variants={anim.bottomBar}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={anim.transition}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-grey-200 bg-white"
          >
            <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
              <Text variant="body-14-m" color="grey-700">
                {doc.placements[scope]?.name} 순서 변경 {movedCount}건
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
          </motion.div>
        )}
      </AnimatePresence>
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
