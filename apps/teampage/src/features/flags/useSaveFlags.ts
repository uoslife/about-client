'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FlagsResponse, SaveFlagsVariables } from '@/entities/flags';
import { flagsKeys, requestFlagsApi } from '@/entities/flags';

/**
 * 설정을 저장한다 — 초안(draft)이면 private 만, 발행(publish)이면 public 까지.
 *
 * 응답을 그대로 캐시에 밀어 넣는다(setQueryData). 저장 응답에는 새 ETag 가 들어
 * 있고, 다시 읽어오는 사이에 다른 저장이 끼어들면 낡은 ETag 로 다음 저장이 409 가
 * 되기 때문이다. 이력은 새 버전이 하나 생겼으니 무효화한다.
 */
export const useSaveFlags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: SaveFlagsVariables) =>
      requestFlagsApi<FlagsResponse>('/api/flags', {
        method: 'PUT',
        body: JSON.stringify(variables),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<FlagsResponse>(flagsKeys.bundle(), data);
      queryClient.invalidateQueries({ queryKey: flagsKeys.versions() });
    },
  });
};
