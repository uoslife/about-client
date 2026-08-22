import { bannerState, type Banner, type DraftPrivateDoc, type PrivateDoc } from '../model';

/**
 * 이전 문서와 현재 시각을 함께 봐야 판정되는 불변식.
 * 필드 하나만 보고 알 수 있는 것은 zod 스키마가 잡는다.
 */

export interface BannerIssue {
  path: string;
  message: string;
}

/** 서버가 채우는 필드. 사용자가 바꾼 것이 아니므로 비교에서 뺀다. */
const SERVER_OWNED = ['createdBy', 'createdAt', 'updatedBy', 'updatedAt'] as const;

const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value ?? null);
};

/** position 은 발행 재정규화로 밀릴 수 있어 "바뀌었다" 로 볼 수 없다. */
const comparable = (banner: Banner) => {
  const rest = { ...banner } as Partial<Banner>;
  SERVER_OWNED.forEach((field) => delete rest[field]);
  delete rest.position;
  return stable(rest);
};

/** 감사 필드(누가·언제)를 새로 찍을지 판정할 때도 같은 기준을 쓴다. */
export const isSameBanner = (before: Banner | undefined, after: Banner) =>
  Boolean(before) && comparable(before as Banner) === comparable(after);

export const validateBannersUpdate = (
  previous: PrivateDoc | null,
  next: DraftPrivateDoc,
  now: Date = new Date(),
): BannerIssue[] => {
  const issues: BannerIssue[] = [];
  if (!previous) return issues;

  Object.entries(previous.banners).forEach(([id, before]) => {
    const after = next.banners[id];
    const state = bannerState(before, now);

    if (!after) {
      if (state !== 'scheduled' || before.terminatedAt) {
        issues.push({ path: `banners.${id}`, message: `${before.name}: 게시 예정인 배너만 삭제할 수 있습니다.` });
      }
      return;
    }

    if (state === 'ended') {
      if (!isSameBanner(before, after)) {
        issues.push({ path: `banners.${id}`, message: `${before.name}: 게시 종료된 배너는 수정할 수 없습니다.` });
      }
      return;
    }

    if (state === 'live') {
      if (before.placement !== after.placement) {
        issues.push({ path: `banners.${id}.placement`, message: `${before.name}: 게시 중에는 구좌를 바꿀 수 없습니다.` });
      }
      if (before.startAt !== after.startAt) {
        issues.push({ path: `banners.${id}.startAt`, message: `${before.name}: 게시 중에는 시작일을 바꿀 수 없습니다.` });
      }
    }
  });

  const bannersOf = (placementId: string) =>
    Object.values(next.banners).filter((banner) => banner.placement === placementId);

  Object.entries(previous.placements).forEach(([placementId, placement]) => {
    if (next.placements[placementId]) return;
    const used = bannersOf(placementId).length;
    if (used > 0) {
      issues.push({
        path: `placements.${placementId}`,
        message: `${placement.name}: 배너 ${used}개가 남아 있어 구좌를 삭제할 수 없습니다.`,
      });
    }
  });

  const usageOf = (variableKey: string, valueKey?: string) =>
    Object.values(next.banners).filter((banner) => {
      const values = banner.conditions[variableKey];
      if (!values) return false;
      return valueKey === undefined || values.includes(valueKey);
    }).length;

  Object.entries(previous.variables).forEach(([variableKey, variable]) => {
    const after = next.variables[variableKey];

    if (!after) {
      const used = usageOf(variableKey);
      if (used > 0) {
        issues.push({
          path: `variables.${variableKey}`,
          message: `${variable.label}: 배너 ${used}개가 조건으로 쓰고 있어 삭제할 수 없습니다.`,
        });
      }
      return;
    }

    const remaining = new Set(after.values.map((value) => value.key));
    variable.values.forEach((value) => {
      if (remaining.has(value.key)) return;
      const used = usageOf(variableKey, value.key);
      if (used > 0) {
        issues.push({
          path: `variables.${variableKey}.${value.key}`,
          message: `${variable.label} · ${value.label}: 배너 ${used}개가 쓰고 있어 값을 지울 수 없습니다.`,
        });
      }
    });
  });

  return issues;
};
