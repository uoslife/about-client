'use client';
import { Text } from '@/shared/component/Text';
import type { Placement } from '@/entities/banners';

interface BannerPreviewProps {
  /** 업로드 직후에는 blob URL, 저장된 배너는 CDN URL. 없으면 자리만 잡는다. */
  imageUrl: string;
  placement: Placement | undefined;
  name: string;
}

export function BannerPreview({ imageUrl, placement, name }: BannerPreviewProps) {
  const size = placement?.recommendedSize;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[280px] rounded-[28px] border-[6px] border-grey-800 bg-white p-3 pt-6">
        <span className="mx-auto mb-3 block h-1 w-16 rounded-full bg-grey-300" aria-hidden />
        <div
          className="w-full overflow-hidden rounded-lg bg-grey-100"
          style={{ aspectRatio: size ? `${size.width} / ${size.height}` : '750 / 240' }}
        >
          {imageUrl ? (
            // 업로드 직후 blob URL 이라 next/image 로는 최적화 대상이 아니다.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-body-12-m text-grey-500">
              이미지 없음
            </span>
          )}
        </div>
        <div className="mt-3 h-2 w-1/2 rounded-full bg-grey-100" aria-hidden />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-grey-100" aria-hidden />
      </div>
      <Text variant="body-12-m" color="grey-600">
        {size ? `권장 ${size.width}×${size.height}` : '구좌를 고르면 권장 크기가 표시됩니다'}
      </Text>
    </div>
  );
}
