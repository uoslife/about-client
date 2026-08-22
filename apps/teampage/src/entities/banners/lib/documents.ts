import { isSameBanner } from './validate';
import {
  SCHEMA_VERSION,
  createBannerId,
  bannerState,
  effectiveEnd,
  DRAFT_ID_PREFIX,
  type Banner,
  type DraftPrivateDoc,
  type PrivateDoc,
  type PublicBanner,
  type PublicDoc,
} from '../model';

type AnyDoc = PrivateDoc | DraftPrivateDoc;

const byPosition = (a: [string, Banner], b: [string, Banner]) =>
  a[1].position - b[1].position || a[0].localeCompare(b[0]);

/**
 * 구좌별 `position` 을 0..n-1 로 다시 매긴다.
 *
 * 화면은 순서를 드래그로 바꾸며 중간값을 만들고, 배너 삭제는 구멍을 남긴다.
 * 저장 시점에 한 번 정리해 두면 문서만 보고 노출 순서를 읽을 수 있다.
 */
export const normalizePositions = <T extends AnyDoc>(doc: T): T => {
  const grouped = new Map<string, [string, Banner][]>();

  Object.entries(doc.banners).forEach((entry) => {
    const list = grouped.get(entry[1].placement) ?? [];
    list.push(entry);
    grouped.set(entry[1].placement, list);
  });

  const banners: Record<string, Banner> = {};
  grouped.forEach((list) => {
    list.sort(byPosition).forEach(([id, banner], index) => {
      banners[id] = { ...banner, position: index };
    });
  });

  return { ...doc, banners };
};

/**
 * private → public 투영. 발행할 때마다 새로 만든다.
 *
 * 종료된 배너를 빼는 것이 곧 아카이브다. private 에는 그대로 남아 이력으로 보이고,
 * 앱은 살아 있는 배너만 받는다.
 */
export const toPublicDoc = (doc: PrivateDoc, now: Date = new Date()): PublicDoc => {
  const placements: Record<string, PublicBanner[]> = {};

  Object.keys(doc.placements).forEach((placementId) => {
    placements[placementId] = [];
  });

  Object.entries(doc.banners)
    .filter(([, banner]) => bannerState(banner, now) !== 'ended')
    .sort(byPosition)
    .forEach(([id, banner]) => {
      const list = placements[banner.placement] ?? [];
      const hasConditions = Object.keys(banner.conditions).length > 0;

      list.push({
        id,
        name: banner.name,
        image: { key: banner.image.key, width: banner.image.width, height: banner.image.height },
        landing: banner.landing,
        // 조건이 비면 필드 자체를 넣지 않는다. 앱은 "없음 = 전원" 으로 읽는다.
        ...(hasConditions ? { conditions: banner.conditions } : {}),
        startAt: banner.startAt,
        endAt: effectiveEnd(banner),
      });

      placements[banner.placement] = list;
    });

  return {
    schemaVersion: SCHEMA_VERSION,
    enabled: doc.enabled,
    version: doc.publishedVersion,
    placements,
  };
};

/**
 * 새 배너(`new_` 임시 키)에 서버가 id 를 발급한다.
 *
 * 클라이언트가 id 를 만들면 같은 id 가 두 번 나올 수 있고, 그 배너를 참조하는
 * exposure 로그가 서로 다른 배너를 가리키게 된다.
 */
export const assignBannerIds = (doc: DraftPrivateDoc): PrivateDoc => {
  const taken = new Set(Object.keys(doc.banners).filter((id) => !id.startsWith(DRAFT_ID_PREFIX)));
  const banners: Record<string, Banner> = {};

  Object.entries(doc.banners).forEach(([id, banner]) => {
    if (!id.startsWith(DRAFT_ID_PREFIX)) {
      banners[id] = banner;
      return;
    }

    let next = createBannerId();
    while (taken.has(next)) next = createBannerId();
    taken.add(next);
    banners[next] = banner;
  });

  return { ...doc, banners };
};

/** 누가 언제 만들었고 고쳤는지는 서버가 찍는다. 클라이언트가 보낸 값은 버린다. */
export const stampAudit = (doc: PrivateDoc, previous: PrivateDoc | null, actor: string, now: Date = new Date()): PrivateDoc => {
  const nowIso = now.toISOString();
  const banners: Record<string, Banner> = {};

  Object.entries(doc.banners).forEach(([id, banner]) => {
    const before = previous?.banners[id];

    if (!before) {
      banners[id] = { ...banner, createdBy: actor, createdAt: nowIso, updatedBy: actor, updatedAt: nowIso };
      return;
    }

    const changed = !isSameBanner(before, banner);
    banners[id] = {
      ...banner,
      createdBy: before.createdBy,
      createdAt: before.createdAt,
      updatedBy: changed ? actor : before.updatedBy,
      updatedAt: changed ? nowIso : before.updatedAt,
    };
  });

  return { ...doc, banners };
};
