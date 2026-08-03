import { EMPTY_BUNDLE, HASH_SPEC, SCHEMA_VERSION, type ExperimentDefinition, type FlagsBundle, type MergedExperiment, type PrivateDoc, type PrivateExperiment, type PublicDoc, type PublicExperiment } from '../model';

const toDefinition = (experiment: MergedExperiment): ExperimentDefinition => ({
  status: experiment.status,
  startAt: experiment.startAt,
  endAt: experiment.endAt,
  seed: experiment.seed,
  hash: experiment.hash,
  variants: experiment.variants.map((variant) => ({ key: variant.key, range: variant.range })),
});

const isSameDefinition = (a: ExperimentDefinition | null | undefined, b: ExperimentDefinition) =>
  Boolean(a) && JSON.stringify(a) === JSON.stringify(b);

/**
 * public + private → 백오피스가 다루는 병합 형태.
 *
 * 발행되지 않은 변경사항(`pendingDefinition`)이 있으면 그쪽을 우선해서 보여준다.
 * (초안은 public에 나가지 않으므로 정의도 private에 함께 보관한다)
 */
export const mergeDocs = (publicDoc: PublicDoc | null, privateDoc: PrivateDoc | null): FlagsBundle => {
  if (!publicDoc && !privateDoc) return EMPTY_BUNDLE;

  const experimentIds = Array.from(
    new Set([...Object.keys(publicDoc?.experiments ?? {}), ...Object.keys(privateDoc?.experiments ?? {})]),
  );

  const experiments: Record<string, MergedExperiment> = {};

  experimentIds.forEach((id) => {
    const publicExperiment = publicDoc?.experiments?.[id];
    const privateExperiment = privateDoc?.experiments?.[id];
    const definition = privateExperiment?.pendingDefinition ?? publicExperiment ?? null;

    experiments[id] = {
      status: definition?.status ?? 'draft',
      startAt: definition?.startAt ?? '',
      endAt: definition?.endAt ?? '',
      seed: definition?.seed ?? id,
      hash: HASH_SPEC,
      variants: definition?.variants ?? [],
      campaignName: privateExperiment?.campaignName ?? id,
      owner: privateExperiment?.owner ?? '',
      docUrl: privateExperiment?.docUrl ?? '',
      memo: privateExperiment?.memo ?? '',
      updatedBy: privateExperiment?.updatedBy ?? '',
      updatedAt: privateExperiment?.updatedAt ?? '',
      // public에 없으면 아직 발행되지 않은 실험이다.
      isDraft: privateExperiment?.isDraft ?? !publicExperiment,
      hasPendingChanges: Boolean(privateExperiment?.pendingDefinition),
    };
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    enabled: publicDoc?.enabled ?? true,
    version: publicDoc?.version ?? 0,
    experiments,
  };
};

/**
 * public 오브젝트 생성.
 * 초안(isDraft)은 공개하지 않고, 사람/메모/링크는 절대 담지 않는다.
 */
export const toPublicDoc = (bundle: FlagsBundle, nextVersion: number): PublicDoc => {
  const experiments: Record<string, PublicExperiment> = {};

  Object.entries(bundle.experiments).forEach(([id, experiment]) => {
    if (experiment.isDraft) return;
    experiments[id] = toDefinition(experiment);
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    enabled: bundle.enabled,
    version: nextVersion,
    experiments,
  };
};

/** 서버가 채우는 필드(updatedBy/updatedAt)와 파생값을 뺀 나머지를 비교한다. */
const isSameExperiment = (a: MergedExperiment | undefined, b: MergedExperiment) => {
  const strip = (experiment: MergedExperiment) => {
    const rest = { ...experiment } as Partial<MergedExperiment>;
    delete rest.updatedAt;
    delete rest.updatedBy;
    delete rest.hasPendingChanges;
    return rest;
  };
  if (!a) return false;
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
};

/**
 * private 오브젝트 생성. updatedBy/updatedAt은 서버가 채운다(클라이언트 값을 믿지 않는다).
 *
 * - mode 'publish' → 정의가 public으로 나갔으므로 pendingDefinition을 비운다.
 * - mode 'draft'   → 정의를 pendingDefinition에 보관한다(public과 같으면 비운다).
 */
export const toPrivateDoc = (
  bundle: FlagsBundle,
  previousBundle: FlagsBundle,
  previousPublic: PublicDoc | null,
  actor: string,
  mode: 'draft' | 'publish',
): PrivateDoc => {
  const now = new Date().toISOString();
  const experiments: Record<string, PrivateExperiment> = {};

  Object.entries(bundle.experiments).forEach(([id, experiment]) => {
    const before = previousBundle.experiments[id];
    const changed = !isSameExperiment(before, experiment);
    const definition = toDefinition(experiment);
    const publishedDefinition = previousPublic?.experiments?.[id] ?? null;

    const pendingDefinition =
      mode === 'publish' || (!experiment.isDraft && isSameDefinition(publishedDefinition, definition))
        ? null
        : definition;

    experiments[id] = {
      campaignName: experiment.campaignName,
      owner: experiment.owner,
      docUrl: experiment.docUrl,
      memo: experiment.memo,
      updatedBy: changed ? actor : before?.updatedBy || actor,
      updatedAt: changed ? now : before?.updatedAt || now,
      // 발행 여부는 단방향이다 — 한 번 public 에 나간 실험은 초안으로 돌아가지
      // 않는다. 클라이언트가 isDraft: true 를 보내도 무시한다.
      //
      // draft 모드는 public 을 건드리지 않으므로, 이걸 허용하면 private 은
      // "미발행" 이라 하는데 public 에는 남아 앱이 계속 실행하는 상태가 만들어진다.
      // 발행된 실험을 앱에서 빼려면 status='ended' 로 발행한다.
      isDraft: publishedDefinition ? false : experiment.isDraft,
      pendingDefinition,
    };
  });

  return { schemaVersion: SCHEMA_VERSION, experiments };
};
