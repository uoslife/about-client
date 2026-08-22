import { BANNER_STATE_LABEL, bannerState, privateDocSchema, type BannerVersionSummary } from '../model';

/** 이력 화면에서 버전을 고를 수 있도록 문서 한 개를 몇 줄로 줄인다. */
export const summarizePrivateDoc = (raw: unknown, now: Date = new Date()): BannerVersionSummary | null => {
  const parsed = privateDocSchema.safeParse(raw);
  if (!parsed.success) return null;

  const doc = parsed.data;
  const banners = Object.values(doc.banners)
    .sort((a, b) => a.placement.localeCompare(b.placement) || a.position - b.position)
    .map((banner) => {
      const placementName = doc.placements[banner.placement]?.name ?? banner.placement;
      return `${placementName} · ${banner.name} · ${BANNER_STATE_LABEL[bannerState(banner, now)]}`;
    });

  return {
    publishedVersion: doc.publishedVersion,
    enabled: doc.enabled,
    bannerCount: banners.length,
    banners,
  };
};
