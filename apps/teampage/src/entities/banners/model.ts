import { z } from 'zod';
import { ASSET_PREFIX } from './config';

/**
 * 배너 모델.
 *
 * private 문서(`private/banners/v1/{env}.json`)가 단일 진실이다. 백오피스는 이것만
 * 읽고 쓰며, public 문서는 발행할 때마다 여기서 다시 만든다(`lib/documents.ts`).
 * 상태·종료 유형 같은 파생값은 저장하지 않는다 — 시각이 지나면 저장된 값이 거짓이 된다.
 */

export const SCHEMA_VERSION = 1;

/** 성별·학년처럼 값을 입력하지 않은 사용자. 변수 정의가 아니라 조건에만 올라온다. */
export const UNKNOWN_VALUE = '__unknown__';

/** 서버가 새 배너 id 를 발급한다. 클라이언트는 새 배너를 이 접두사로 보낸다. */
export const DRAFT_ID_PREFIX = 'new_';

/** ISO 8601 + 오프셋 필수. naive datetime(오프셋 없음)은 거부한다. flags 와 같은 규칙. */
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const isoWithOffset = z
  .string()
  .regex(ISO_WITH_OFFSET, '날짜는 오프셋을 포함한 ISO 8601 형식이어야 합니다. (예: 2026-08-31T00:00:00+09:00)');

export const bannerIdSchema = z.string().regex(/^bn_[a-z0-9]{10}$/, '배너 ID 형식이 올바르지 않습니다.');

const draftBannerIdSchema = z
  .string()
  .regex(/^new_[A-Za-z0-9_-]{1,32}$/, '새 배너의 임시 ID 형식이 올바르지 않습니다.');

/** 저장 요청에서만 허용. 서버가 `bn_` id 로 바꿔 쓴다. */
export const bannerKeySchema = z.union([bannerIdSchema, draftBannerIdSchema]);

export const placementIdSchema = z
  .string()
  .min(1, '구좌 ID를 입력해주세요.')
  .max(40, '구좌 ID는 40자 이하여야 합니다.')
  .regex(/^[a-z][a-z0-9_]*$/, '구좌 ID는 영문 소문자로 시작하고 소문자/숫자/언더스코어만 사용할 수 있습니다.');

export const variableKeySchema = z
  .string()
  .min(1, '변수 키를 입력해주세요.')
  .max(40, '변수 키는 40자 이하여야 합니다.')
  .regex(/^[a-z][a-z0-9_]*$/, '변수 키는 영문 소문자로 시작하고 소문자/숫자/언더스코어만 사용할 수 있습니다.');

/** 학년 "1" 처럼 숫자로 시작하는 값이 있어 변수 키와 규칙이 다르다. */
export const variableValueKeySchema = z
  .string()
  .min(1, '값 키를 입력해주세요.')
  .max(40, '값 키는 40자 이하여야 합니다.')
  .regex(/^[A-Za-z0-9_]+$/, '값 키는 영문/숫자/언더스코어만 사용할 수 있습니다.')
  .refine((key) => !key.startsWith('__'), '`__` 로 시작하는 값 키는 예약어입니다.');

/** 조건 배열에는 정의된 값 키와 `__unknown__` 만 올 수 있다. */
const conditionValueSchema = z.union([variableValueKeySchema, z.literal(UNKNOWN_VALUE)]);

export const recommendedSizeSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const placementSchema = z.object({
  name: z.string().min(1, '구좌 이름을 입력해주세요.').max(40),
  navOrder: z.number().int().min(0),
  recommendedSize: recommendedSizeSchema,
  maxBytes: z.number().int().positive(),
});

export const variableValueSchema = z.object({
  key: variableValueKeySchema,
  label: z.string().min(1, '값 라벨을 입력해주세요.').max(40),
});

export const variableSchema = z.object({
  label: z.string().min(1, '변수 라벨을 입력해주세요.').max(40),
  order: z.number().int().min(0),
  /** 화면에서 `__unknown__` 이 무엇을 뜻하는지 설명하는 문구 */
  unknownNote: z.string().max(200).default(''),
  values: z
    .array(variableValueSchema)
    .min(1, '변수에는 값이 최소 1개 필요합니다.')
    .superRefine((values, ctx) => {
      const keys = values.map((value) => value.key);
      if (new Set(keys).size !== keys.length) {
        ctx.addIssue({ code: 'custom', message: '값 키가 중복되었습니다.' });
      }
    }),
});

export const bannerImageSchema = z.object({
  key: z.string().startsWith(ASSET_PREFIX, `이미지 키는 ${ASSET_PREFIX} 로 시작해야 합니다.`),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().positive(),
  originalName: z.string().max(200).default(''),
});

export const LANDING_TYPES = ['inapp', 'external'] as const;
export type LandingType = (typeof LANDING_TYPES)[number];

export const bannerLandingSchema = z
  .object({
    type: z.enum(LANDING_TYPES),
    url: z.string().min(1, '랜딩 주소를 입력해주세요.').max(500),
  })
  .superRefine((landing, ctx) => {
    if (landing.type === 'external' && !z.url().safeParse(landing.url).success) {
      ctx.addIssue({ code: 'custom', message: '외부 링크는 올바른 URL이어야 합니다.' });
    }
  });

export const bannerConditionsSchema = z.record(variableKeySchema, z.array(conditionValueSchema).min(1)).default({});

export const bannerSchema = z
  .object({
    name: z.string().min(1, '배너 이름을 입력해주세요.').max(60),
    /** 정확히 하나. 여러 구좌에 걸려면 배너를 복제한다. */
    placement: placementIdSchema,
    /** 구좌별로 독립. 발행 시 0..n-1 로 재정규화된다. */
    position: z.number().int().min(0),
    image: bannerImageSchema,
    landing: bannerLandingSchema.nullable().default(null),
    /** 비었으면 전원 노출 */
    conditions: bannerConditionsSchema,
    startAt: isoWithOffset,
    scheduledEndAt: isoWithOffset,
    /** 즉시 종료 시각. 기간 종료와 구분하는 유일한 값 */
    terminatedAt: isoWithOffset.nullable().default(null),
    createdBy: z.string().max(120).default(''),
    createdAt: z.string().max(40).default(''),
    updatedBy: z.string().max(120).default(''),
    updatedAt: z.string().max(40).default(''),
  })
  .superRefine((banner, ctx) => {
    if (Date.parse(banner.startAt) >= Date.parse(banner.scheduledEndAt)) {
      ctx.addIssue({ code: 'custom', message: '종료일은 시작일보다 뒤여야 합니다.', path: ['scheduledEndAt'] });
    }
  });

export type Banner = z.infer<typeof bannerSchema>;
export type Placement = z.infer<typeof placementSchema>;
export type BannerVariable = z.infer<typeof variableSchema>;
export type BannerImage = z.infer<typeof bannerImageSchema>;
export type BannerLanding = z.infer<typeof bannerLandingSchema>;
export type BannerConditions = z.infer<typeof bannerConditionsSchema>;

interface DocShape {
  placements: Record<string, Placement>;
  variables: Record<string, BannerVariable>;
  banners: Record<string, Banner>;
}

/** 문서 하나를 다 봐야 알 수 있는 참조 무결성. 필드 단위 스키마로는 표현되지 않는다. */
const checkReferences = (doc: DocShape, ctx: z.RefinementCtx) => {
  const positions = new Map<string, Set<number>>();

  Object.entries(doc.banners).forEach(([id, banner]) => {
    if (!doc.placements[banner.placement]) {
      ctx.addIssue({ code: 'custom', message: `${id}: 없는 구좌(${banner.placement})입니다.` });
      return;
    }

    const taken = positions.get(banner.placement) ?? new Set<number>();
    if (taken.has(banner.position)) {
      ctx.addIssue({ code: 'custom', message: `${banner.placement} 구좌에 같은 순서(${banner.position})가 둘 있습니다.` });
    }
    taken.add(banner.position);
    positions.set(banner.placement, taken);

    Object.entries(banner.conditions).forEach(([variableKey, values]) => {
      const variable = doc.variables[variableKey];
      if (!variable) {
        ctx.addIssue({ code: 'custom', message: `${id}: 없는 변수(${variableKey})를 조건으로 씁니다.` });
        return;
      }
      const allowed = new Set<string>([...variable.values.map((value) => value.key), UNKNOWN_VALUE]);
      (values ?? []).forEach((value) => {
        if (!allowed.has(value)) {
          ctx.addIssue({ code: 'custom', message: `${id}: ${variableKey} 변수에 없는 값(${value})입니다.` });
        }
      });
    });
  });
};

const privateDocShape = {
  schemaVersion: z.literal(SCHEMA_VERSION),
  /** 전역 킬 스위치 */
  enabled: z.boolean(),
  publishedVersion: z.number().int().min(0),
  placements: z.record(placementIdSchema, placementSchema),
  variables: z.record(variableKeySchema, variableSchema),
};

export const privateDocSchema = z
  .object({ ...privateDocShape, banners: z.record(bannerIdSchema, bannerSchema) })
  .superRefine(checkReferences);

/** 저장 요청용. 새 배너는 아직 id 가 없어 `new_` 임시 키로 온다. */
export const draftPrivateDocSchema = z
  .object({ ...privateDocShape, banners: z.record(bannerKeySchema, bannerSchema) })
  .superRefine(checkReferences);

export const publicBannerSchema = z.object({
  id: bannerIdSchema,
  name: z.string(),
  image: z.object({
    key: z.string().startsWith(ASSET_PREFIX),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  landing: bannerLandingSchema.nullable(),
  conditions: z.record(variableKeySchema, z.array(conditionValueSchema).min(1)).optional(),
  startAt: isoWithOffset,
  endAt: isoWithOffset,
});

export const publicDocSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  enabled: z.boolean(),
  version: z.number().int().min(0),
  /** 배열 순서가 곧 노출 순서 */
  placements: z.record(placementIdSchema, z.array(publicBannerSchema)),
});

export const saveBannersPayloadSchema = z.object({
  etag: z.string().nullable(),
  doc: draftPrivateDocSchema,
});

export const rollbackBannersPayloadSchema = z.object({
  versionId: z.string().min(1),
});

export type PrivateDoc = z.infer<typeof privateDocSchema>;
export type DraftPrivateDoc = z.infer<typeof draftPrivateDocSchema>;
export type PublicBanner = z.infer<typeof publicBannerSchema>;
export type PublicDoc = z.infer<typeof publicDocSchema>;
export type SaveBannersPayload = z.infer<typeof saveBannersPayloadSchema>;

export const BANNER_STATES = ['scheduled', 'live', 'ended'] as const;
export type BannerState = (typeof BANNER_STATES)[number];

export const BANNER_STATE_LABEL: Record<BannerState, string> = {
  scheduled: '게시 예정',
  live: '게시 중',
  ended: '게시 종료',
};

export type BannerEndKind = 'immediate' | 'scheduled';

export const BANNER_END_KIND_LABEL: Record<BannerEndKind, string> = {
  immediate: '즉시 종료',
  scheduled: '기간 종료',
};

/** 실제 종료 시각. 즉시 종료가 예정 종료보다 뒤일 수 없다. */
export const effectiveEnd = (banner: Pick<Banner, 'scheduledEndAt' | 'terminatedAt'>): string => {
  if (!banner.terminatedAt) return banner.scheduledEndAt;
  return Date.parse(banner.terminatedAt) < Date.parse(banner.scheduledEndAt)
    ? banner.terminatedAt
    : banner.scheduledEndAt;
};

export const endKind = (banner: Pick<Banner, 'terminatedAt'>): BannerEndKind =>
  banner.terminatedAt ? 'immediate' : 'scheduled';

export const bannerState = (
  banner: Pick<Banner, 'startAt' | 'scheduledEndAt' | 'terminatedAt'>,
  now: Date = new Date(),
): BannerState => {
  const time = now.getTime();
  if (banner.terminatedAt || time >= Date.parse(banner.scheduledEndAt)) return 'ended';
  if (time < Date.parse(banner.startAt)) return 'scheduled';
  return 'live';
};

const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const createBannerId = (): string => {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (byte) => ID_ALPHABET[byte % ID_ALPHABET.length]).join('');
  return `bn_${body}`;
};

export interface BannersResponse {
  doc: PrivateDoc;
  etag: string | null;
  publicLastModified: string | null;
}

export interface BannerAsset {
  key: string;
  width: number;
  height: number;
  bytes: number;
  originalName: string;
}

/**
 * 되돌릴 버전을 고를 때 필요한 것은 바이트 수가 아니라 "그 버전에 뭐가 들어
 * 있었나" 다. 최근 버전들은 내용을 읽어 요약을 함께 내려준다.
 */
export interface BannerVersionSummary {
  publishedVersion: number | null;
  enabled: boolean | null;
  bannerCount: number;
  /** 배너별 한 줄 요약. 예: "홈 · 개강 이벤트 · 게시 중" */
  banners: string[];
}

export interface BannerVersion {
  versionId: string;
  lastModified: string | null;
  isLatest: boolean;
  /** 요약을 읽지 못한 버전(과거 스키마·파싱 실패)은 null */
  summary: BannerVersionSummary | null;
}

export interface BannerVersionsResponse {
  versions: BannerVersion[];
}

/** 실패 응답의 본문. 라우트 핸들러들이 `{ message }` 로 통일해 내려준다. */
export interface BannersApiErrorBody {
  message?: string;
}

export interface SaveBannersVariables {
  etag: string | null;
  doc: DraftPrivateDoc;
}

export interface RollbackBannersVariables {
  versionId: string;
}

export interface UploadBannerAssetVariables {
  file: File;
  placement: string;
}

/** 최초 실행(빈 버킷)에서 GET 이 돌려주는 문서. */
export const EMPTY_PRIVATE_DOC: PrivateDoc = {
  schemaVersion: SCHEMA_VERSION,
  enabled: true,
  publishedVersion: 0,
  placements: {},
  variables: {},
  banners: {},
};
