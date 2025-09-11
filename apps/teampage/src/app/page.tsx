import { Suspense } from 'react';
import _MainPage from '@/page/main-page';

export default function MainPage() {
  return (
    <Suspense>
      <_MainPage />
    </Suspense>
  );
}
