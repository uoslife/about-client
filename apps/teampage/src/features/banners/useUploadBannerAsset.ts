'use client';
import { useMutation } from '@tanstack/react-query';
import type { BannerAsset, UploadBannerAssetVariables } from '@/entities/banners';
import { requestBannersApi } from '@/entities/banners';

/**
 * 배너 이미지를 올리고 문서에 넣을 값을 받는다.
 *
 * 캐시를 건드리지 않는다 — 업로드는 문서를 바꾸지 않고, 반환된 값은 편집 중인
 * 폼으로 들어갔다가 발행 시점에 함께 저장된다.
 */
export const useUploadBannerAsset = () =>
  useMutation({
    mutationFn: ({ file, placement }: UploadBannerAssetVariables) => {
      const form = new FormData();
      form.append('file', file);
      form.append('placement', placement);
      return requestBannersApi<BannerAsset>('/api/banners/assets', { method: 'POST', body: form });
    },
  });
