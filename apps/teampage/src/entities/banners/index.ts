/**
 * banners entity — 배너 CMS 의 도메인 지식.
 *
 * 여기 있는 것: 스키마와 타입, 저장소 키 규칙, private→public 투영과 불변식 검증,
 * 그리고 읽기 쿼리 옵션.
 *
 * 여기 없는 것:
 * - 훅. queryOptions 만 내보내고 useQuery 는 사용처가 부른다. 훅으로 감싸면
 *   enabled·select 같은 화면 사정이 인자로 새어 들어와, entity 가 특정 화면을
 *   알게 된다.
 * - 쓰기(mutation). features/banners 에 있다. 캐시를 무효화하는 코드가 읽기 쪽에
 *   섞이면 무엇이 언제 갱신되는지 추적할 곳이 없어진다.
 * - S3 접근(app/api/_lib/s3.ts). 서버 전용이라 이 배럴로 재export 하면
 *   클라이언트 번들에 AWS SDK 가 딸려온다.
 */

export * from './model';
export * from './config';
export * from './lib/documents';
export * from './lib/validate';
export * from './lib/summary';
export * from './api/client';
export * from './api/queries';
