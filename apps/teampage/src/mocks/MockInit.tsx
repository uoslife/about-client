'use client';

import { useEffect } from 'react';

/**
 * 로컬 개발 전용. NEXT_PUBLIC_ENABLE_MOCK=true 일 때만 MSW 워커를 시작한다.
 * 프로덕션 빌드(NODE_ENV==='production')에서는 아예 아무 것도 하지 않으며,
 * 동적 import 라 msw 가 프로덕션 번들에 포함되지 않는다.
 */
export function MockInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (process.env.NEXT_PUBLIC_ENABLE_MOCK !== 'true') return;

    let cancelled = false;
    import('./browser').then(({ worker }) => {
      if (cancelled) return;
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
        // eslint-disable-next-line no-console
        console.info(
          '%c[mock] MSW 활성화 — API_ORIGIN 요청은 로컬에서 처리되며 프로덕션에 도달하지 않습니다.',
          'color:#22c55e;font-weight:bold',
        );
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
