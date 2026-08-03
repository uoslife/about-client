import { queryOptions } from '@tanstack/react-query';
import type { FlagVersionsResponse, FlagsResponse } from '../model';
import { requestFlagsApi } from './client';

/**
 * flags 의 쿼리 키.
 *
 * 한곳에 모아 두는 이유는 쓰기 쪽(features/flags)이 저장 후 무엇을 무효화할지
 * 알아야 하기 때문이다. 배열 리터럴을 양쪽에 각각 적으면 한쪽만 바뀌었을 때
 * 무효화가 조용히 빗나가고, 화면은 낡은 값을 계속 보여준다.
 */
export const flagsKeys = {
  all: ['ab-test'] as const,
  bundle: () => [...flagsKeys.all, 'flags'] as const,
  versions: () => [...flagsKeys.all, 'flag-versions'] as const,
};

/**
 * 현재 설정(public + private 병합).
 *
 * 사용처는 `useQuery(flagsQueryOptions())` 로 끼워 넣기만 한다. entity 가 훅을
 * 노출하지 않는 이유는, 훅이면 enabled·select·suspense 같은 화면 사정이 하나씩
 * 인자로 새어 들어와 결국 entity 가 특정 화면 사정을 알게 되기 때문이다.
 * queryOptions 는 스프레드해서 덮어쓸 수 있으니 그 사정은 사용처에 남는다.
 *
 * staleTime 0 · refetchOnWindowFocus false 는 화면 취향이 아니라 도메인 제약이다.
 * 동아리원 누구나 동시에 편집할 수 있으니 항상 최신을 읽어야 하고(ETag 도 이
 * 응답에서 온다), 반대로 편집 중 탭을 옮겼다 돌아왔을 때 폼이 초기화되면 작업이
 * 사라진다. retry false 는 저장 충돌(409)을 되풀이 요청하지 않기 위함이다.
 */
export const flagsQueryOptions = () =>
  queryOptions({
    queryKey: flagsKeys.bundle(),
    queryFn: () => requestFlagsApi<FlagsResponse>('/api/flags'),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

/** 발행 이력. 이력 화면에서만 필요하므로 enabled 는 사용처가 붙인다. */
export const flagVersionsQueryOptions = () =>
  queryOptions({
    queryKey: flagsKeys.versions(),
    queryFn: () => requestFlagsApi<FlagVersionsResponse>('/api/flags/versions'),
    refetchOnWindowFocus: false,
    retry: false,
  });
