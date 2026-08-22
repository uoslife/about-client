import { queryOptions } from '@tanstack/react-query';
import type { BannerVersionsResponse, BannersResponse } from '../model';
import { requestBannersApi } from './client';

/**
 * banners 의 쿼리 키.
 *
 * 한곳에 모아 두는 이유는 쓰기 쪽(features/banners)이 저장 후 무엇을 무효화할지
 * 알아야 하기 때문이다. 배열 리터럴을 양쪽에 각각 적으면 한쪽만 바뀌었을 때
 * 무효화가 조용히 빗나가고, 화면은 낡은 값을 계속 보여준다.
 */
export const bannersKeys = {
  all: ['banners'] as const,
  doc: () => [...bannersKeys.all, 'doc'] as const,
  versions: () => [...bannersKeys.all, 'versions'] as const,
};

/**
 * 현재 배너 문서(private).
 *
 * staleTime 0 · refetchOnWindowFocus false 는 화면 취향이 아니라 도메인 제약이다.
 * 누구나 동시에 편집할 수 있으니 항상 최신을 읽어야 하고(ETag 도 이 응답에서 온다),
 * 반대로 편집 중 탭을 옮겼다 돌아왔을 때 폼이 초기화되면 작업이 사라진다.
 * retry false 는 저장 충돌(409)을 되풀이 요청하지 않기 위함이다.
 */
export const bannersQueryOptions = () =>
  queryOptions({
    queryKey: bannersKeys.doc(),
    queryFn: () => requestBannersApi<BannersResponse>('/api/banners'),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

/** 발행 이력. 이력 화면에서만 필요하므로 enabled 는 사용처가 붙인다. */
export const bannerVersionsQueryOptions = () =>
  queryOptions({
    queryKey: bannersKeys.versions(),
    queryFn: () => requestBannersApi<BannerVersionsResponse>('/api/banners/versions'),
    refetchOnWindowFocus: false,
    retry: false,
  });
