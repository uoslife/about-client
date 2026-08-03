/**
 * flags entity — A/B 테스트 · feature flag 설정의 도메인 지식.
 *
 * 여기 있는 것: 스키마와 타입, 저장소 키 규칙, 들어온 데이터의 변환(병합·분리·
 * 비율↔구간·diff), 그리고 쿼리 옵션.
 *
 * 여기 없는 것: 화면(widgets/ab-test), S3 접근(app/api/flags/_lib/s3.ts — 서버
 * 전용이라 이 배럴로 재export 하면 클라이언트 번들에 AWS SDK 가 딸려온다).
 */

export * from './model';
export * from './config';
export * from './lib/documents';
export * from './lib/range';
export * from './lib/schedule';
export * from './lib/sql';
export * from './lib/diff';
export * from './lib/experiment';
export * from './lib/summary';
export * from './api/useFlags';
