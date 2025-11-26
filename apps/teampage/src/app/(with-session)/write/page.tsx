import { Suspense } from 'react';
import _WritePage from '@/page/write-page';

export default function WritePage() {
  return (
    <Suspense>
      <_WritePage />
    </Suspense>
  );
}
