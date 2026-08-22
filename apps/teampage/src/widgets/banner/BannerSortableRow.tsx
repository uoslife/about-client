'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';
import { BannerDragHandle, BannerRow, type BannerRowProps } from './BannerRow';

/**
 * 손잡이에만 센서를 붙인다. 행 전체가 draggable 이면 제목 버튼·메뉴를 누를 수 없다.
 * 키보드 조작도 손잡이에서 시작한다(Space 로 집고 방향키로 이동).
 */
export function BannerSortableRow(props: BannerRowProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
    animateLayoutChanges: () => !prefersReducedMotion,
  });

  return (
    <BannerRow
      {...props}
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: prefersReducedMotion ? undefined : transition,
      }}
      isDragging={isDragging}
      dragHandle={<BannerDragHandle {...attributes} {...listeners} />}
    />
  );
}
