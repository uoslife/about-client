/**
 * cafeteria entity — 학식 편집기의 도메인 지식.
 *
 * 여기 있는 것: apis 학식 응답 스키마와 타입, 식당 origin·코너·기본가 상수, 저장 body 변환과
 * 검증, 저장 결과 예측(previewSaved), 읽기 쿼리 옵션, 앱 학식 카드(ui).
 *
 * 여기 없는 것:
 * - 훅. queryOptions 만 내보내고 useQuery 는 사용처가 부른다.
 * - 쓰기(mutation)와 수정 폼. features/cafeteria-editor 에 있다.
 * - 화면(widgets/cafeteria-editor).
 * - 개발용 mock 저장소(api/mock.ts). api/client.ts의 cafeteriaApi가 개발 서버에서만 연다.
 */

export * from './model';
export * from './lib/corners';
export * from './lib/preview';
export * from './lib/origin';
export * from './lib/select';
export * from './lib/toSaveMenusBody';
export * from './lib/validate';
export * from './api/client';
export * from './api/queries';
export * from './ui/CafeteriaCard';
export * from './ui/CafeteriaCardList';
