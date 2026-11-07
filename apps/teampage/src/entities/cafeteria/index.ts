/**
 * cafeteria entity — 학식 편집기의 도메인 지식.
 *
 * 여기 있는 것: apis 학식 응답 스키마와 타입, 식당 origin 상수, 저장 body 변환과
 * 검증, 그리고 읽기 쿼리 옵션.
 *
 * 여기 없는 것:
 * - 훅. queryOptions 만 내보내고 useQuery 는 사용처가 부른다.
 * - 쓰기(mutation). features/cafeteria-editor 에 있다.
 * - 화면(widgets/cafeteria-editor).
 */

export * from './model';
export * from './lib/origin';
export * from './api/client';
export * from './api/queries';
