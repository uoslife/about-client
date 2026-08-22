'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BannersResponse, SaveBannersVariables } from '@/entities/banners';
import { bannersKeys, requestBannersApi } from '@/entities/banners';

/**
 * 배너 문서를 발행한다 — private 를 갱신하고 public 을 다시 만든다.
 *
 * 응답을 그대로 캐시에 밀어 넣는다(setQueryData). 응답에는 새 ETag 와 서버가
 * 발급한 배너 id 가 들어 있어, 다시 읽어오기 전에 저장하면 409 가 나거나 같은
 * 배너가 두 번 만들어진다. 이력은 새 버전이 생겼으니 무효화한다.
 */
export const useSaveBanners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: SaveBannersVariables) =>
      requestBannersApi<BannersResponse>('/api/banners', {
        method: 'PUT',
        body: JSON.stringify(variables),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<BannersResponse>(bannersKeys.doc(), data);
      queryClient.invalidateQueries({ queryKey: bannersKeys.versions() });
    },
  });
};
