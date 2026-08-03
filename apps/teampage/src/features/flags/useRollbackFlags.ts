'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RollbackFlagsVariables } from '@/entities/flags';
import { flagsKeys, requestFlagsApi } from '@/entities/flags';

/**
 * 지난 버전의 내용을 다시 발행한다.
 *
 * 되돌리기도 결국 쓰기라서 새 버전이 하나 더 생긴다 — 되돌린 기록 자체가 이력에
 * 남는다. 저장과 달리 응답에 문서가 없어(버전 ID 만 온다) 캐시에 넣을 것이 없으므로
 * 양쪽을 무효화해 다시 읽는다.
 */
export const useRollbackFlags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RollbackFlagsVariables) =>
      // 응답은 쓰지 않는다(어느 버전을 되돌렸는지만 온다). 아래 무효화로 다시 읽는다.
      requestFlagsApi<unknown>('/api/flags/rollback', {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flagsKeys.bundle() });
      queryClient.invalidateQueries({ queryKey: flagsKeys.versions() });
    },
  });
};
