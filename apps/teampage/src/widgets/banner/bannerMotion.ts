'use client';
import { useMemo } from 'react';
import { useReducedMotion, type Transition, type Variants } from 'motion/react';

// 배너 화면의 모든 전환이 공유하는 값. 갈라지면 같은 화면 안에서 속도가 어긋난다.
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DURATION_S = 0.2;

interface BannerMotionPreset {
  transition: Transition;
  scrim: Variants;
  drawer: Variants;
  bottomBar: Variants;
  /** 목록 행. 이동 + 페이드 */
  row: Variants;
  /** dnd-kit sortable 행. transform 은 sortable 이 style 로 잡고 있어 opacity 만 건드린다. */
  rowFade: Variants;
  collapse: Variants;
}

/**
 * 축소 모드에서는 이동·확대를 없애고 페이드만 남기며 지속시간을 0 으로 둔다.
 * motion 의 useReducedMotion 은 첫 렌더에 null 을 줄 수 있다.
 */
export function useBannerMotion(): BannerMotionPreset {
  const prefersReduced = useReducedMotion() ?? false;

  return useMemo(() => {
    const transition: Transition = { duration: prefersReduced ? 0 : DURATION_S, ease: EASE };
    const shift = <T extends string | number>(value: T) => (prefersReduced ? 0 : value);

    return {
      transition,
      scrim: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
      drawer: {
        hidden: { x: shift('100%'), opacity: prefersReduced ? 0 : 1 },
        visible: { x: 0, opacity: 1 },
      },
      bottomBar: {
        hidden: { y: shift('100%'), opacity: prefersReduced ? 0 : 1 },
        visible: { y: 0, opacity: 1 },
      },
      row: {
        hidden: { opacity: 0, y: shift(-4) },
        visible: { opacity: 1, y: 0 },
        gone: { opacity: 0, y: shift(4) },
      },
      rowFade: { hidden: { opacity: 0 }, visible: { opacity: 1 }, gone: { opacity: 0 } },
      collapse: { hidden: { height: 0, opacity: 0 }, visible: { height: 'auto', opacity: 1 } },
    };
  }, [prefersReduced]);
}
