'use client';

import { useEffect, useState } from 'react';

const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

// 로컬 개발에서만 opt-in으로 켜지는 네트워크 목킹 부트스트랩.
// 프로덕션 빌드에서는 NEXT_PUBLIC_API_MOCKING이 설정되지 않으므로 동적 import 자체가 실행되지 않는다.
// worker.start()가 끝나기 전에 하위 컴포넌트가 API를 호출하면 목킹을 우회할 수 있어,
// 준비될 때까지 children 렌더링을 지연시킨다.
export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) return;

    let mounted = true;
    import('./browser').then(({ startWorkerOnce }) => {
      startWorkerOnce().then(() => {
        if (mounted) setReady(true);
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
};
