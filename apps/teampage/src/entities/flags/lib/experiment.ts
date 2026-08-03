import { HASH_SPEC, type FlagsBundle, type MergedExperiment } from '../model';
import { draftsToVariants } from './range';
import { ymdToKstIso } from './schedule';

export const createEmptyExperiment = (experimentId: string): MergedExperiment => {
  const today = new Date();
  const kst = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  const startYmd = kst.toISOString().slice(0, 10);
  const endKst = new Date(kst.getTime() + 14 * 24 * 60 * 60 * 1000);
  const endYmd = endKst.toISOString().slice(0, 10);

  return {
    // 'draft' 는 status 가 아니라 발행 여부(isDraft)로 표현한다. 신규 실험은
    // 어차피 isDraft: true 라 public 에 나가지 않으므로, status 는 발행 후에
    // 의미가 생긴다 — 그때 곧바로 실행되지 않도록 'paused' 로 시작한다.
    status: 'paused',
    startAt: ymdToKstIso(startYmd),
    endAt: ymdToKstIso(endYmd),
    seed: experimentId,
    hash: HASH_SPEC,
    variants: draftsToVariants([
      { key: 'A', percent: 50 },
      { key: 'B', percent: 50 },
    ]),
    campaignName: '',
    owner: '',
    docUrl: '',
    memo: '',
    updatedBy: '',
    updatedAt: '',
    isDraft: true,
    hasPendingChanges: false,
  };
};

export const upsertExperiment = (
  bundle: FlagsBundle,
  experimentId: string,
  experiment: MergedExperiment,
): FlagsBundle => ({
  ...bundle,
  experiments: { ...bundle.experiments, [experimentId]: experiment },
});

/**
 * 번들에서 실험을 제거한다.
 *
 * 별도의 삭제 API 가 없다. toPublicDoc·toPrivateDoc 은 매번 번들에서 문서를
 * 다시 만들므로, 번들에서 빼고 발행하면 두 문서 모두 그 실험 없이 기록된다.
 * S3 오브젝트를 지우는 게 아니라 덮어쓰는 것이라 DeleteObject 권한도 필요 없다.
 *
 * 지운 내용은 버킷 versioning 에 남아 발행 이력에서 되돌릴 수 있다.
 */
export const removeExperiment = (bundle: FlagsBundle, experimentId: string): FlagsBundle => {
  const experiments = { ...bundle.experiments };
  delete experiments[experimentId];
  return { ...bundle, experiments };
};
