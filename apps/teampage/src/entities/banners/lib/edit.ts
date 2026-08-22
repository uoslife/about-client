import {
  DRAFT_ID_PREFIX,
  UNKNOWN_VALUE,
  bannerState,
  effectiveEnd,
  type Banner,
  type BannerState,
  type BannerVariable,
  type DraftPrivateDoc,
  type Placement,
} from '../model';

/**
 * 문서를 통째로 바꿔 끼우는 순수 함수들.
 *
 * 저장 API 가 문서 단위라 화면도 "다음 문서" 를 만들어 보낸다. 부분 갱신 요청이
 * 없으므로 여기 있는 것이 곧 모든 편집 연산이다.
 */

export interface BannerEntry {
  id: string;
  banner: Banner;
}

/** 서버가 `bn_` id 를 발급하기 전까지 폼과 문서를 잇는 임시 키. */
export const createDraftBannerKey = () =>
  `${DRAFT_ID_PREFIX}${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;

export const isDraftBannerKey = (key: string) => key.startsWith(DRAFT_ID_PREFIX);

export const upsertBanner = (doc: DraftPrivateDoc, key: string, banner: Banner): DraftPrivateDoc => ({
  ...doc,
  banners: { ...doc.banners, [key]: banner },
});

export const removeBanner = (doc: DraftPrivateDoc, key: string): DraftPrivateDoc => {
  const banners = { ...doc.banners };
  delete banners[key];
  return { ...doc, banners };
};

/** 즉시 종료. 기간 종료와 구분되는 유일한 표시가 `terminatedAt` 이다. */
export const terminateBanner = (doc: DraftPrivateDoc, key: string, at: string): DraftPrivateDoc => {
  const banner = doc.banners[key];
  if (!banner) return doc;
  return upsertBanner(doc, key, { ...banner, terminatedAt: at });
};

export const upsertPlacement = (doc: DraftPrivateDoc, id: string, placement: Placement): DraftPrivateDoc => ({
  ...doc,
  placements: { ...doc.placements, [id]: placement },
});

export const removePlacement = (doc: DraftPrivateDoc, id: string): DraftPrivateDoc => {
  const placements = { ...doc.placements };
  delete placements[id];
  return { ...doc, placements };
};

export const upsertVariable = (doc: DraftPrivateDoc, key: string, variable: BannerVariable): DraftPrivateDoc => ({
  ...doc,
  variables: { ...doc.variables, [key]: variable },
});

export const removeVariable = (doc: DraftPrivateDoc, key: string): DraftPrivateDoc => {
  const variables = { ...doc.variables };
  delete variables[key];
  return { ...doc, variables };
};

export const placementEntries = (doc: DraftPrivateDoc) =>
  Object.entries(doc.placements).sort(([, a], [, b]) => a.navOrder - b.navOrder);

export const variableEntries = (doc: DraftPrivateDoc) =>
  Object.entries(doc.variables).sort(([, a], [, b]) => a.order - b.order);

export const bannersOfPlacement = (doc: DraftPrivateDoc, placementId: string): BannerEntry[] =>
  Object.entries(doc.banners)
    .filter(([, banner]) => banner.placement === placementId)
    .map(([id, banner]) => ({ id, banner }))
    .sort((a, b) => a.banner.position - b.banner.position || a.id.localeCompare(b.id));

export const nextPosition = (doc: DraftPrivateDoc, placementId: string) =>
  bannersOfPlacement(doc, placementId).reduce((max, entry) => Math.max(max, entry.banner.position + 1), 0);

/** 구좌 삭제 가능 여부. 종료된 배너도 문서에 남아 있으므로 함께 센다. */
export const placementUsage = (doc: DraftPrivateDoc, placementId: string) =>
  bannersOfPlacement(doc, placementId).length;

export const variableUsage = (doc: DraftPrivateDoc, variableKey: string, valueKey?: string) =>
  Object.values(doc.banners).filter((banner) => {
    const values = banner.conditions[variableKey];
    if (!values) return false;
    return valueKey === undefined || values.includes(valueKey);
  }).length;

/** 드래그·화살표로 만든 새 순서를 position 에 반영한다. */
export const reorderPlacement = (doc: DraftPrivateDoc, orderedIds: string[]): DraftPrivateDoc => {
  const banners = { ...doc.banners };
  orderedIds.forEach((id, index) => {
    const banner = banners[id];
    if (banner) banners[id] = { ...banner, position: index };
  });
  return { ...doc, banners };
};

/**
 * 일부만 재배치한다.
 *
 * 게시 중 배너만 순서를 바꾸는데, 같은 구좌의 예정·종료 배너도 position 을
 * 갖는다. 전체를 다시 매기면 그들의 상대 순서까지 밀리므로, 바꾸는 배너들이
 * 원래 쓰던 자리에만 새 순서를 채워 넣는다.
 */
export const reorderWithinSlots = (
  doc: DraftPrivateDoc,
  placementId: string,
  orderedSubsetIds: string[],
): DraftPrivateDoc => {
  const all = bannersOfPlacement(doc, placementId).map((entry) => entry.id);
  const subset = new Set(orderedSubsetIds);
  const next = [...all];
  let cursor = 0;
  all.forEach((id, index) => {
    if (!subset.has(id)) return;
    next[index] = orderedSubsetIds[cursor];
    cursor += 1;
  });
  return reorderPlacement(doc, next);
};

export const moveInArray = <T>(items: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/**
 * 상태별 묶음. 저장된 값이 아니라 매 렌더 `now` 로 계산한다.
 * 게시 중·예정은 노출 순서대로, 종료는 최근에 끝난 것부터 본다.
 */
export const groupByState = (
  entries: BannerEntry[],
  now: Date,
): Record<BannerState, BannerEntry[]> => {
  const groups: Record<BannerState, BannerEntry[]> = { live: [], scheduled: [], ended: [] };
  entries.forEach((entry) => groups[bannerState(entry.banner, now)].push(entry));

  const byPosition = (a: BannerEntry, b: BannerEntry) =>
    a.banner.placement.localeCompare(b.banner.placement) ||
    a.banner.position - b.banner.position ||
    a.id.localeCompare(b.id);

  groups.live.sort(byPosition);
  groups.scheduled.sort(byPosition);
  groups.ended.sort((a, b) => Date.parse(effectiveEnd(b.banner)) - Date.parse(effectiveEnd(a.banner)));
  return groups;
};

/** 조건 하나를 `1학년·2학년·값 미상` 처럼 한 줄로 만든다. */
export const describeCondition = (variable: BannerVariable | undefined, values: string[]) =>
  values
    .map((value) => {
      if (value === UNKNOWN_VALUE) return '값 미상';
      return variable?.values.find((item) => item.key === value)?.label ?? value;
    })
    .join('·');

/**
 * 게시 중인 배너가 전부 조건부인 구좌.
 *
 * 조건에 맞지 않는 사용자에게는 구좌가 통째로 비어 보인다 — 문서만 보고는
 * 드러나지 않는 상태라 목록에서 경고한다.
 */
export const allConditionalPlacements = (doc: DraftPrivateDoc, now: Date): string[] =>
  Object.keys(doc.placements).filter((placementId) => {
    const live = bannersOfPlacement(doc, placementId).filter(
      (entry) => bannerState(entry.banner, now) === 'live',
    );
    return live.length > 0 && live.every((entry) => Object.keys(entry.banner.conditions).length > 0);
  });
