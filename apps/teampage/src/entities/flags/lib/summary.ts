import { EXPERIMENT_STATUS_LABEL, type FlagVersionSummary, type PrivateDoc, type PublicDoc } from '../model';
import { bucketsToPercent } from './range';

/**
 * 발행 이력 행에 보여줄 요약을 만든다.
 *
 * 실패하면 null 을 돌려준다 — 스키마가 바뀐 과거 버전이나 손상된 문서가
 * 이력 조회 전체를 깨뜨리면 안 된다. 그런 버전은 원본 다운로드로 확인한다.
 */
export const summarizePublic = (raw: unknown): FlagVersionSummary | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const doc = raw as Partial<PublicDoc>;
  const experiments = doc.experiments ?? {};

  return {
    manifestVersion: typeof doc.version === 'number' ? doc.version : null,
    experimentCount: Object.keys(experiments).length,
    experiments: Object.entries(experiments).map(([id, experiment]) => {
      const status = EXPERIMENT_STATUS_LABEL[experiment.status] ?? experiment.status;
      const ratio = experiment.variants
        .map((variant) => `${variant.key} ${bucketsToPercent(variant.range[1] - variant.range[0])}%`)
        .join(' / ');
      return `${id} · ${status} · ${ratio}`;
    }),
    enabled: typeof doc.enabled === 'boolean' ? doc.enabled : null,
    updatedBy: null,
  };
};

export const summarizePrivate = (raw: unknown): FlagVersionSummary | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const doc = raw as Partial<PrivateDoc>;
  const experiments = doc.experiments ?? {};
  const entries = Object.entries(experiments);

  return {
    manifestVersion: null,
    experimentCount: entries.length,
    experiments: entries.map(([id, experiment]) => `${id} · ${experiment.campaignName || '(캠페인명 없음)'}`),
    enabled: null,
    updatedBy: entries.map(([, experiment]) => experiment.updatedBy).find(Boolean) ?? null,
  };
};
