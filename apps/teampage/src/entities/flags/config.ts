/**
 * flags 저장소의 키 규칙.
 *
 * "어느 환경의 설정을 어느 경로에서 읽는가" 는 도메인 지식이라 entity 가 소유한다.
 * S3 접근 자체(클라이언트 생성·읽기·조건부 쓰기)와 버킷은 인프라라서
 * `app/api/_lib/s3.ts` 에 둔다 — 서버 전용이고, entity 배럴로 재export 하면
 * 클라이언트 컴포넌트가 AWS SDK 를 번들에 끌고 들어온다.
 */

// 기본값을 alpha 로 둔다. 파드는 ConfigMap 이 FLAGS_ENV 를 명시하므로 영향이 없고,
// 설정을 빠뜨렸을 때만 갈린다 — 그때 프로덕션 설정을 건드리는 것보다 alpha 가 맞다.
export const FLAGS_ENV = process.env.FLAGS_ENV ?? 'alpha';

/** CDN 이 서빙하는 공개 매니페스트. 앱이 읽는 최소 필드만 담는다. */
export const PUBLIC_KEY = `public/v1/${FLAGS_ENV}.json`;

/** 발행자 전용. 캠페인명·담당자·메모. CDN 으로 나가지 않는다. */
export const PRIVATE_KEY = `private/v1/${FLAGS_ENV}.json`;

/** CDN TTL 을 결정한다. 업로드 시 반드시 붙인다. */
export const CACHE_CONTROL = 'max-age=60';
export const CONTENT_TYPE = 'application/json';
