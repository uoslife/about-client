'use client';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';

export default function BackofficePage() {
  return (
    <div className="flex flex-col gap-16 mb-8 sm:mb-60 w-full">
      <ArticleBanner title="Tech" description={'backoffice page'} />
    </div>
  );
}
