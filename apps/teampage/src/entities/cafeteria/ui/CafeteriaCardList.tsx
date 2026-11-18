'use client';
import { useEffect, useRef } from 'react';
import type { Cafeteria } from '../model';
import { CafeteriaCard } from './CafeteriaCard';

type CafeteriaCardListProps = {
  cafeterias: Cafeteria[];
  /** 테두리로 표시할 식당(Before 폰). */
  selectedId?: string;
  /** 스크롤만 맞출 식당(After 폰은 테두리 없이 스크롤만). 없으면 selectedId를 쓴다. */
  scrollToId?: string;
  onSelect?: (cafeteriaId: string) => void;
  showPopular?: boolean;
};

/** Before·After 폰 안의 식당 카드 목록. */
export function CafeteriaCardList({
  cafeterias,
  selectedId,
  scrollToId,
  onSelect,
  showPopular,
}: CafeteriaCardListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const targetId = scrollToId ?? selectedId;

  useEffect(() => {
    if (!targetId) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-cafeteria-id="${targetId}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [targetId]);

  return (
    <div ref={listRef} className="flex flex-col gap-[16px] p-[16px]">
      {cafeterias.map((cafeteria) => (
        <CafeteriaCard
          key={cafeteria.id}
          cafeteria={cafeteria}
          showPopular={showPopular}
          selected={selectedId === cafeteria.id}
          onSelect={onSelect && (() => onSelect(cafeteria.id))}
        />
      ))}
    </div>
  );
}
