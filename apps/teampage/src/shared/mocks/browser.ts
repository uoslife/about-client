import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// React 18 StrictMode/Fast Refresh가 effect를 두 번 실행할 수 있어, 같은 worker 인스턴스에
// start()가 중복 호출되면 msw가 "already enabled" 에러를 던진다. 모듈 스코프에 프로미스를
// 캐시해 실제 시작은 한 번만 일어나게 한다.
let startPromise: Promise<void> | null = null;

export const startWorkerOnce = () => {
  if (!startPromise) {
    startPromise = worker
      .start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      })
      .then(() => undefined);
  }
  return startPromise;
};
