/**
 * flags 를 바꾸는 기능 — 저장·발행·되돌리기.
 *
 * 읽기와 쓰기를 레이어로 갈라 둔다.
 *   읽기: entities/flags 의 queryOptions. 화면은 useQuery 에 끼워 넣기만 한다.
 *   쓰기: 여기. 무엇이 언제 무효화되는지가 이 두 파일에만 있다.
 *
 * 무효화 규칙이 흩어지면, 저장은 됐는데 목록만 낡은 값을 보여주는 버그를 어디서
 * 찾아야 하는지 알 수 없게 된다. 캐시를 건드리는 코드는 전부 이 슬라이스 안에 있다.
 */

export { useSaveFlags } from './useSaveFlags';
export { useRollbackFlags } from './useRollbackFlags';
