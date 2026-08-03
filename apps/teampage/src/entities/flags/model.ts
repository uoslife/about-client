import { z } from 'zod';

/**
 * A/B 테스트 플래그 모델.
 *
 * S3에는 두 개의 오브젝트로 나뉘어 저장된다.
 * - public  (`public/v1/{env}.json`)  : CDN으로 공개. 앱이 읽는 최소 필드만.
 * - private (`private/v1/{env}.json`) : IAM으로만 접근. 담당자/메모/기획서 링크 등.
 *
 * 클라이언트(백오피스)는 두 문서를 합친 `FlagsBundle` 하나만 다루고,
 * 서버(route handler)가 저장 시점에 public/private으로 다시 쪼갠다.
 */

export const SCHEMA_VERSION = 1;
export const TOTAL_BUCKETS = 10000;
export const HASH_SPEC = 'sha256-7hex-10000';

export const EXPERIMENT_STATUSES = ['draft', 'running', 'paused', 'ended'] as const;
export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];

export const EXPERIMENT_STATUS_LABEL: Record<ExperimentStatus, string> = {
  draft: '초안',
  running: '실행 중',
  paused: '일시중지',
  ended: '종료',
};

/**
 * 화면에서 고를 수 있는 상태.
 *
 * 'draft' 는 제외한다. 초안은 상태가 아니라 **발행 여부**다.
 *
 * 상태에 넣으면 이미 발행된 실험을 다시 '초안' 으로 되돌릴 수 있게 되는데,
 * 그러면 toPublicDoc 이 그 실험을 public 에서 빼내 앱에서 사라진다. 결과가
 * 'ended' 와 같아 축이 중복되고, 라이브 실험을 끄는 파괴적 동작에 '임시 저장'
 * 이라는 이름이 붙는다.
 *
 * 발행 여부는 단방향이다 — 미발행(초안) → 발행됨. 발행된 실험을 앱에서 빼려면
 * 'ended' 로 발행한다. 스키마에는 'draft' 를 남긴다: 이미 저장된 값을 읽지
 * 못하면 문서 전체가 깨진다.
 */
export const SELECTABLE_EXPERIMENT_STATUSES = ['running', 'paused', 'ended'] as const;

/** ISO 8601 + 오프셋 필수. naive datetime(오프셋 없음)은 거부한다. */
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const isoWithOffset = z
  .string()
  .regex(ISO_WITH_OFFSET, '날짜는 오프셋을 포함한 ISO 8601 형식이어야 합니다. (예: 2026-08-31T00:00:00+09:00)');

export const experimentIdSchema = z
  .string()
  .min(1, '실험 ID를 입력해주세요.')
  .max(64, '실험 ID는 64자 이하여야 합니다.')
  .regex(/^[a-z][a-z0-9_]*$/, '실험 ID는 영문 소문자로 시작하고 소문자/숫자/언더스코어만 사용할 수 있습니다.');

export const variantKeySchema = z
  .string()
  .min(1, 'variant 키를 입력해주세요.')
  .max(16, 'variant 키는 16자 이하여야 합니다.')
  .regex(/^[A-Za-z0-9_]+$/, 'variant 키는 영문/숫자/언더스코어만 사용할 수 있습니다.');

export const rangeSchema = z
  .tuple([z.number().int().min(0).max(TOTAL_BUCKETS), z.number().int().min(0).max(TOTAL_BUCKETS)])
  .refine(([start, end]) => start < end, { message: '구간의 시작은 끝보다 작아야 합니다.' });

export const variantSchema = z.object({
  key: variantKeySchema,
  range: rangeSchema,
});

/** 구간 겹침 / 합계 검증. 합이 10000 미만인 것은 홀드아웃이므로 정상. */
const validateVariants = (variants: { key: string; range: [number, number] }[], ctx: z.RefinementCtx) => {
  const keys = variants.map((variant) => variant.key);
  if (new Set(keys).size !== keys.length) {
    ctx.addIssue({ code: 'custom', message: 'variant 키가 중복되었습니다.' });
  }

  const sorted = [...variants].sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].range[0] < sorted[i - 1].range[1]) {
      ctx.addIssue({
        code: 'custom',
        message: `구간이 겹칩니다. (${sorted[i - 1].key} / ${sorted[i].key})`,
      });
    }
  }

  const total = variants.reduce((acc, variant) => acc + (variant.range[1] - variant.range[0]), 0);
  if (total > TOTAL_BUCKETS) {
    ctx.addIssue({ code: 'custom', message: `구간의 합(${total})이 ${TOTAL_BUCKETS}을 초과할 수 없습니다.` });
  }
};

const experimentDefinitionCheck = (
  experiment: { variants: { key: string; range: [number, number] }[]; startAt: string; endAt: string },
  ctx: z.RefinementCtx,
) => {
  validateVariants(experiment.variants, ctx);
  if (new Date(experiment.startAt).getTime() >= new Date(experiment.endAt).getTime()) {
    ctx.addIssue({ code: 'custom', message: '종료일은 시작일보다 뒤여야 합니다.' });
  }
};

/** 앱이 실제로 읽는 실험 정의(= public에 나가는 형태). */
export const experimentDefinitionSchema = z.object({
  status: z.enum(EXPERIMENT_STATUSES),
  startAt: isoWithOffset,
  endAt: isoWithOffset,
  seed: z.string().min(1),
  hash: z.literal(HASH_SPEC),
  variants: z.array(variantSchema).min(1, 'variant는 최소 1개 이상이어야 합니다.'),
});

/** public 오브젝트에 들어가는 실험 정의. 여기에는 절대 사람/메모/링크를 넣지 않는다. */
export const publicExperimentSchema = experimentDefinitionSchema.superRefine(experimentDefinitionCheck);

/** private 오브젝트에 들어가는 운영 메타데이터. */
export const privateExperimentSchema = z.object({
  campaignName: z.string().min(1, '캠페인명을 입력해주세요.').max(120),
  owner: z.string().max(60).default(''),
  docUrl: z.union([z.literal(''), z.url('올바른 URL이 아닙니다.')]).default(''),
  memo: z.string().max(2000).default(''),
  updatedBy: z.string().default(''),
  updatedAt: z.string().default(''),
  isDraft: z.boolean().default(false),
  /**
   * 아직 발행되지 않은 정의. 초안 저장은 public을 건드리지 않으므로
   * 기간/구간 같은 정의도 여기에 함께 보관했다가 발행 시 public으로 옮긴다.
   * 발행이 끝나면 null이 된다.
   */
  pendingDefinition: experimentDefinitionSchema.nullable().default(null),
});

export const publicDocSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  enabled: z.boolean(),
  version: z.number().int().min(0),
  experiments: z.record(experimentIdSchema, publicExperimentSchema),
});

export const privateDocSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  experiments: z.record(experimentIdSchema, privateExperimentSchema),
});

/** 백오피스가 다루는 병합 형태. */
export const mergedExperimentSchema = z.object({
  status: z.enum(EXPERIMENT_STATUSES),
  startAt: isoWithOffset,
  endAt: isoWithOffset,
  seed: z.string().min(1),
  hash: z.literal(HASH_SPEC),
  variants: z.array(variantSchema).min(1, 'variant는 최소 1개 이상이어야 합니다.'),
  campaignName: z.string().min(1, '캠페인명을 입력해주세요.').max(120),
  owner: z.string().max(60).default(''),
  docUrl: z.union([z.literal(''), z.url('올바른 URL이 아닙니다.')]).default(''),
  memo: z.string().max(2000).default(''),
  updatedBy: z.string().default(''),
  updatedAt: z.string().default(''),
  isDraft: z.boolean().default(false),
  /** 발행되지 않은 변경사항이 있는지 (서버가 계산해 내려주는 파생값) */
  hasPendingChanges: z.boolean().default(false),
});

export const flagsBundleSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  enabled: z.boolean(),
  version: z.number().int().min(0),
  experiments: z.record(
    experimentIdSchema,
    mergedExperimentSchema.superRefine((experiment, ctx) => {
      validateVariants(experiment.variants, ctx);
      if (new Date(experiment.startAt).getTime() >= new Date(experiment.endAt).getTime()) {
        ctx.addIssue({ code: 'custom', message: '종료일은 시작일보다 뒤여야 합니다.' });
      }
    }),
  ),
});

export const etagsSchema = z.object({
  public: z.string().nullable(),
  private: z.string().nullable(),
});

export const savePayloadSchema = z.object({
  mode: z.enum(['draft', 'publish']),
  etags: etagsSchema,
  bundle: flagsBundleSchema,
});

export const rollbackPayloadSchema = z.object({
  scope: z.enum(['public', 'private']),
  versionId: z.string().min(1),
});

export type Variant = z.infer<typeof variantSchema>;
export type ExperimentDefinition = z.infer<typeof experimentDefinitionSchema>;
export type PublicExperiment = z.infer<typeof publicExperimentSchema>;
export type PrivateExperiment = z.infer<typeof privateExperimentSchema>;
export type PublicDoc = z.infer<typeof publicDocSchema>;
export type PrivateDoc = z.infer<typeof privateDocSchema>;
export type MergedExperiment = z.infer<typeof mergedExperimentSchema>;
export type FlagsBundle = z.infer<typeof flagsBundleSchema>;
export type Etags = z.infer<typeof etagsSchema>;
export type SavePayload = z.infer<typeof savePayloadSchema>;

export interface FlagsResponse {
  bundle: FlagsBundle;
  etags: Etags;
  /** 마지막으로 public 오브젝트가 갱신된 시각 (ISO) */
  publicLastModified: string | null;
}

/**
 * 되돌릴 버전을 고를 때 필요한 것은 바이트 수가 아니라 "그 버전에 뭐가 들어
 * 있었나" 다. 그래서 최근 버전들은 내용을 읽어 요약을 함께 내려준다.
 * (오래된 버전은 요약 없이 원본 다운로드로 확인한다)
 */
export interface FlagVersionSummary {
  /** 매니페스트 내부의 발행 카운터. exposure 이벤트의 manifest_version 과 대조하는 키 */
  manifestVersion: number | null;
  experimentCount: number;
  /** 실험별 한 줄 요약. 예: "home_notice_position 실행중 A 50% / B 50%" */
  experiments: string[];
  /** 전역 킬 스위치 상태 (public 문서만) */
  enabled: boolean | null;
  /** private 문서의 발행자 */
  updatedBy: string | null;
}

export interface FlagVersion {
  versionId: string;
  lastModified: string | null;
  isLatest: boolean;
  /** 요약을 읽지 못한 버전(오래된 버전·파싱 실패)은 null */
  summary: FlagVersionSummary | null;
}

export interface FlagVersionsResponse {
  public: FlagVersion[];
  private: FlagVersion[];
}

export const EMPTY_BUNDLE: FlagsBundle = {
  schemaVersion: SCHEMA_VERSION,
  enabled: true,
  version: 0,
  experiments: {},
};
