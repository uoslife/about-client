'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RollbackBannersVariables } from '@/entities/banners';
import { bannersKeys, requestBannersApi } from '@/entities/banners';

/**
 * 지난 private 버전을 다시 발행한다.
 *
 * 되돌리기도 결국 쓰기라서 새 버전이 하나 더 생긴다 — 되돌린 기록 자체가 이력에
 * 남는다. 응답에 문서가 없어(버전 ID 만 온다) 캐시에 넣을 것이 없으므로 양쪽을
 * 무효화해 다시 읽는다.
 */
export const useRollbackBanners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RollbackBannersVariables) =>
      requestBannersApi<unknown>('/api/banners/rollback', {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannersKeys.doc() });
      queryClient.invalidateQueries({ queryKey: bannersKeys.versions() });
    },
  });
};
