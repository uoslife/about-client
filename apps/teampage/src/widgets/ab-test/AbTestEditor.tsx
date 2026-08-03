'use client';
import { useEffect, useMemo, useState } from 'react';
import { Text } from '@/shared/component/Text';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import {
  EXPERIMENT_STATUS_LABEL,
  SELECTABLE_EXPERIMENT_STATUSES,
  HASH_SPEC,
  experimentIdSchema,
  type ExperimentStatus,
  type MergedExperiment,
} from '@/entities/flags';
import {
  createEmptyExperiment,
  diffExperiment,
  draftsToVariants,
  estimateReassignedRatio,
  isoToKstYmd,
  sumPercent,
  variantsToDrafts,
  ymdToKstIso,
  type VariantDraft,
} from '@/entities/flags';
import { AbTestDateField } from './AbTestDateField';
import { AbTestDiffTable } from './AbTestDiffTable';
import {
  AbTestCard,
  AbTestField,
  AbTestLockedBadge,
  AbTestPrivateBadge,
  fieldInputClass,
  fieldInputErrorClass,
  fieldReadOnlyClass,
} from './AbTestField';
import { AbTestRatioEditor } from './AbTestRatioEditor';
import { AbTestSqlSnippet } from './AbTestSqlSnippet';

interface AbTestEditorProps {
  /** 편집 대상 실험 ID. 신규 생성이면 빈 문자열 */
  experimentId: string;
  /** 저장 전 원본. 신규면 undefined */
  original?: MergedExperiment;
  /** 이미 존재하는 실험 ID 목록 (중복 검사용) */
  existingIds: string[];
  isSaving: boolean;
  onCancel: () => void;
  onSave: (mode: 'draft' | 'publish', experimentId: string, experiment: MergedExperiment) => void;
  /** 편집 모드에서만 전달된다. 신규 생성 중에는 지울 대상이 없다. */
  onDelete?: (experimentId: string, experiment: MergedExperiment) => void;
}

export function AbTestEditor({
  experimentId,
  original,
  existingIds,
  isSaving,
  onCancel,
  onSave,
  onDelete,
}: AbTestEditorProps) {
  const isNew = !original;
  const base = useMemo(() => original ?? createEmptyExperiment(''), [original]);
  const { open: openConfirmModal } = useConfirmModal();

  const [id, setId] = useState(experimentId);
  const [campaignName, setCampaignName] = useState(base.campaignName);
  const [owner, setOwner] = useState(base.owner);
  const [docUrl, setDocUrl] = useState(base.docUrl);
  const [memo, setMemo] = useState(base.memo);
  const [status, setStatus] = useState<ExperimentStatus>(base.status);
  const [startYmd, setStartYmd] = useState(isoToKstYmd(base.startAt));
  const [endYmd, setEndYmd] = useState(isoToKstYmd(base.endAt));
  const [drafts, setDrafts] = useState<VariantDraft[]>(
    base.variants.length > 0
      ? variantsToDrafts(base.variants)
      : [
          { key: 'A', percent: 50 },
          { key: 'B', percent: 50 },
        ],
  );

  const variants = useMemo(() => draftsToVariants(drafts), [drafts]);
  const totalPercent = sumPercent(drafts);

  /**
   * 오류를 필드별로 나눈다. 이전에는 문자열 배열 하나에 모아 화면 하단에만
   * 뿌렸는데, 폼이 길어 어느 입력이 문제인지 알 수 없었다.
   */
  const fieldErrors = {
    id: (() => {
      if (!isNew) return null;
      const parsed = experimentIdSchema.safeParse(id);
      if (!parsed.success) return parsed.error.issues[0]?.message ?? '실험 ID를 확인해주세요.';
      if (existingIds.includes(id)) return '이미 사용 중인 실험 ID입니다.';
      return null;
    })(),
    campaignName: campaignName.trim() ? null : '캠페인명을 입력해주세요.',
    period: (() => {
      if (!startYmd || !endYmd) return '실험 기간을 선택해주세요.';
      if (startYmd >= endYmd) return '종료일은 시작일보다 뒤여야 합니다.';
      return null;
    })(),
    variantKey: (() => {
      if (drafts.some((draft) => !draft.key.trim())) return '그룹 키를 입력해주세요.';
      if (new Set(drafts.map((draft) => draft.key)).size !== drafts.length) return '그룹 키가 중복되었습니다.';
      return null;
    })(),
    percent: (() => {
      if (totalPercent > 100) return `비율의 합이 100%를 초과했습니다. (현재 ${totalPercent}%)`;
      if (drafts.some((draft) => draft.percent <= 0)) return '각 그룹의 비율은 0%보다 커야 합니다.';
      return null;
    })(),
  };

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;
  const isValid = errorCount === 0 && !isSaving;

  const buildExperiment = (isDraft: boolean): MergedExperiment => ({
    status,
    startAt: ymdToKstIso(startYmd),
    endAt: ymdToKstIso(endYmd),
    seed: base.seed && !isNew ? base.seed : id,
    hash: HASH_SPEC,
    variants,
    campaignName: campaignName.trim(),
    owner: owner.trim(),
    docUrl: docUrl.trim(),
    memo,
    updatedBy: base.updatedBy,
    updatedAt: base.updatedAt,
    isDraft,
    hasPendingChanges: base.hasPendingChanges,
  });

  /**
   * 아직 발행되지 않았는지.
   *
   * 발행 여부는 단방향이다 — 한 번 public 에 나간 실험은 초안으로 돌아가지 않는다.
   * status 로 표현하면 발행된 실험을 다시 '초안' 으로 되돌릴 수 있게 되고, 그러면
   * toPublicDoc 이 그 실험을 public 에서 빼내 앱에서 사라진다(= 'ended' 와 결과가
   * 같아 축이 중복된다). 서버도 같은 규칙을 강제한다(documents.ts).
   */
  const isUnpublished = original?.isDraft ?? true;

  /**
   * 변경 여부. 신규 생성은 원본이 없어 항상 변경으로 판정된다.
   * isDraft 를 원본과 같게 맞춰 비교하므로 순수한 필드 변경만 잡힌다.
   */
  const fieldDiff = useMemo(
    () => diffExperiment(original, buildExperiment(isUnpublished)),
    // buildExperiment 는 아래 상태들에서 파생된다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [original, isUnpublished, id, campaignName, owner, docUrl, memo, status, startYmd, endYmd, variants],
  );
  const isDirty = fieldDiff.length > 0;

  /**
   * 임시 저장은 발행 여부와 무관하게 가능하다. 저장 구조가 두 경우를 이미 구분한다.
   *   미발행 → private 에만 정의를 둔다 (public 에 없음)
   *   발행됨 → public 은 그대로, pendingDefinition 에 작업 중 정의를 둔다
   * 어느 쪽이든 isDraft 는 건드리지 않는다.
   */
  const canSaveDraft = isValid && isDirty;
  /** 미발행 실험은 내용이 그대로여도 '발행' 자체가 의미 있는 변경이다. */
  const canPublish = isValid && (isDirty || isUnpublished);

  /**
   * 저장하지 않고 나가려 할 때 확인한다.
   *
   * 초안 저장을 없앤 대신 이탈 시점에 지킨다. 브라우저를 닫는 경로는
   * beforeunload 가, 화면 내 이동은 아래 confirm 모달이 맡는다.
   */
  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleLeave = () => {
    if (!isDirty) {
      onCancel();
      return;
    }
    openConfirmModal({
      title: '저장하지 않고 나가시겠습니까?',
      description: '변경한 내용이 사라집니다.',
      confirmText: '나가기',
      cancelText: '계속 편집',
      variant: 'danger',
      onConfirm: onCancel,
    });
  };

  /** 실행 중인 실험의 구간이 바뀌면 경고한다. 막지는 않는다. */
  const reassignedRatio = useMemo(() => {
    if (!original || original.status !== 'running') return null;
    const ratio = estimateReassignedRatio(original.variants, variants);
    return ratio > 0 ? ratio : null;
  }, [original, variants]);

  const handleDraftSave = () => {
    if (!canSaveDraft) return;
    // 앱에 나가지 않으므로 되돌릴 수 없는 동작이 아니다. 확인을 받지 않는다.
    // isDraft 는 원본 값을 유지한다 — 임시 저장이 발행 여부를 바꾸지는 않는다.
    onSave('draft', id, buildExperiment(isUnpublished));
  };

  const handlePublish = () => {
    if (!canPublish) return;
    const next = buildExperiment(false);

    openConfirmModal({
      title: '실제 유저 대상으로 발행하시겠습니까?',
      description: <AbTestDiffTable lines={diffExperiment(original, next)} reassignedRatio={reassignedRatio} />,
      confirmText: '발행',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => onSave('publish', id, next),
    });
  };

  return (
    /* 단일 중앙 컬럼.
       처음엔 우측에 요약 패널을 뒀는데, 그 패널이 보여주던 값(상태·기간·그룹·구간)은
       모두 폼에 이미 있었다. 여백을 채우려고 만든 중복이었으므로 없애고, 읽는 순서
       그대로 한 줄로 쌓는다: 설정 → 확인 → 분석 방법. */
    <div className="mx-auto w-full max-w-[880px] pb-28">
      {/* 뒤로 가기는 제목의 "부모 맥락" 이라 제목 위에 두고 무게를 낮춘다.
          테두리 버튼으로 제목 옆에 두면 시각적 무게가 제목과 같거나 더 커져
          무엇이 이 화면의 주제인지 흐려진다. */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleLeave}
          className="group -ml-1 mb-1 flex items-center gap-1 rounded px-1 py-0.5 text-body-14-m text-grey-600 transition-colors hover:text-grey-900"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          A/B 테스트 목록
        </button>
        <Text variant="title-24-b" color="grey-900">
          {isNew ? '새 실험 만들기' : '실험 편집'}
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <AbTestCard title="기본 정보">
          <AbTestField
            label="실험 ID"
            htmlFor="abt-id"
            aside={isNew ? undefined : <AbTestLockedBadge reason="버킷 해시의 시드라서 바꾸면 전원이 재배정됩니다." />}
            hint={
              isNew
                ? '버킷 해시의 시드로 쓰입니다. 만든 뒤에는 바꿀 수 없습니다.'
                : '해시 시드라서 값을 바꾸면 전체 유저가 다시 배정됩니다.'
            }
            error={fieldErrors.id}
          >
            <input
              id="abt-id"
              type="text"
              value={id}
              readOnly={!isNew}
              onChange={(event) => setId(event.target.value)}
              placeholder="home_notice_position"
              className={!isNew ? fieldReadOnlyClass : fieldErrors.id ? fieldInputErrorClass : fieldInputClass}
            />
          </AbTestField>

          <AbTestField
            label="캠페인명"
            htmlFor="abt-campaign"
            aside={<AbTestPrivateBadge />}
            error={fieldErrors.campaignName}
          >
            <input
              id="abt-campaign"
              type="text"
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              placeholder="홈 공지 위치 조정"
              className={fieldErrors.campaignName ? fieldInputErrorClass : fieldInputClass}
            />
          </AbTestField>

          <div className="grid gap-5 md:grid-cols-2">
            <AbTestField label="담당자" htmlFor="abt-owner" aside={<AbTestPrivateBadge />}>
              <input
                id="abt-owner"
                type="text"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="이름"
                className={fieldInputClass}
              />
            </AbTestField>
            <AbTestField label="기획서 링크" htmlFor="abt-doc" aside={<AbTestPrivateBadge />}>
              <input
                id="abt-doc"
                type="text"
                value={docUrl}
                onChange={(event) => setDocUrl(event.target.value)}
                placeholder="https://"
                className={fieldInputClass}
              />
            </AbTestField>
          </div>
        </AbTestCard>

        <AbTestCard title="상태와 기간" description="상태는 즉시 적용되는 스위치이고, 기간은 예정된 일정입니다.">
          <AbTestField
            label="앱 동작 상태"
            htmlFor="abt-status"
            hint="'실행 중'이 아니면 기간과 무관하게 중지됩니다. 앱에 내보낼지는 아래 저장 버튼이 정합니다."
          >
            <select
              id="abt-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ExperimentStatus)}
              className={`${fieldInputClass} md:max-w-[240px]`}
            >
              {/* 목록에 없는 기존 값도 보여준다. mergeDocs 는 정의가 없는 실험의
                  status 를 'draft' 로 채우는데, 그 값이 옵션에 없으면 select 가
                  첫 옵션으로 조용히 바꿔버린다. */}
              {(SELECTABLE_EXPERIMENT_STATUSES as readonly ExperimentStatus[]).includes(status) ? null : (
                <option value={status}>{EXPERIMENT_STATUS_LABEL[status]} (이전 값)</option>
              )}
              {SELECTABLE_EXPERIMENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {EXPERIMENT_STATUS_LABEL[value]}
                </option>
              ))}
            </select>
          </AbTestField>

          <AbTestField
            label="기간 (KST)"
            hint={`00:00 기준으로 저장됩니다. ${startYmd ? ymdToKstIso(startYmd) : '-'} ~ ${endYmd ? ymdToKstIso(endYmd) : '-'}`}
            error={fieldErrors.period}
          >
            <div className="flex items-center gap-3">
              <AbTestDateField value={startYmd} onChange={setStartYmd} />
              <Text variant="body-16-m" color="grey-600" as="span">
                ~
              </Text>
              <AbTestDateField value={endYmd} onChange={setEndYmd} />
            </div>
          </AbTestField>
        </AbTestCard>

        <AbTestCard
          title="그룹 비율"
          description="총 10,000 버킷을 반개구간 [시작, 끝) 으로 나눕니다. 비율을 바꿔도 경계에 걸친 유저만 이동합니다."
        >
          <AbTestRatioEditor
            drafts={drafts}
            variants={variants}
            editableKeys={isNew}
            onChange={setDrafts}
            keyError={fieldErrors.variantKey}
            percentError={fieldErrors.percent}
          />
          {reassignedRatio !== null && (
            <div className="rounded-lg border border-danger-ui px-4 py-3">
              <Text variant="body-14-b" color="grey-900">
                실행 중인 실험의 구간을 바꾸고 있습니다
              </Text>
              <Text variant="body-14-m" color="grey-700">
                발행하면 전체 유저의 약 {(reassignedRatio * 100).toFixed(2)}%가 다른 그룹으로 재배정됩니다.
              </Text>
            </div>
          )}
        </AbTestCard>

        <AbTestCard title="메모" description="운영용 기록입니다. 앱에 내려가지 않습니다.">
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={4}
            placeholder="변경 이유, 협의 내용 등"
            className={`${fieldInputClass} resize-none`}
          />
        </AbTestCard>

        <AbTestSqlSnippet experimentId={id} variants={variants} />

        {/* 위험 구역.
            폼 맨 아래에 두고 버튼 무게를 낮춘다 — 실수로 누를 자리가 아니고,
            찾아서 누를 자리다. 경고는 확인 모달이 상세히 한다. */}
        {onDelete && original && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-grey-200 p-5 max-md:flex-col max-md:items-start">
            <div>
              <Text variant="body-14-b" color="grey-900">
                실험 삭제
              </Text>
              <Text variant="body-12-m" color="grey-600">
                공개 설정과 운영 메타데이터에서 함께 제거됩니다. 발행 이력에는 남아 되돌릴 수 있습니다.
              </Text>
            </div>
            <button
              type="button"
              onClick={() => onDelete(experimentId, original)}
              disabled={isSaving}
              className="shrink-0 rounded-lg border border-danger-ui px-4 py-[10px] text-body-14-b text-danger-ui transition-colors hover:bg-danger-lighter disabled:cursor-not-allowed disabled:opacity-40"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 하단 고정 액션 바 — 버튼과 "왜 저장할 수 없는지" 를 같은 자리에 둔다.
          임시 저장은 앱에 영향이 없고, 발행은 있다. 둘의 결과가 다르므로 버튼도
          둘이다. 대신 무게를 달리해 무엇이 주된 동작인지 드러낸다. */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-grey-200 bg-white">
        <div className="mx-auto flex max-w-[880px] items-center justify-between gap-4 px-6 py-4 max-md:flex-col max-md:items-stretch max-md:px-4">
          <Text variant="body-14-m" color={errorCount > 0 ? 'danger-ui' : 'grey-600'}>
            {errorCount > 0
              ? `입력을 확인해주세요 · ${errorCount}건`
              : !isDirty && !isUnpublished
                ? '변경된 내용이 없습니다.'
                : isUnpublished
                  ? '아직 앱에 나가지 않았습니다. 발행하면 유저에게 반영됩니다.'
                  : status === 'running'
                    ? '발행하면 최대 60초 안에 유저에게 반영됩니다.'
                    : `발행되지만 '${EXPERIMENT_STATUS_LABEL[status]}' 상태라 유저에게는 노출되지 않습니다.`}
          </Text>
          <div className="flex shrink-0 items-center gap-3 max-md:justify-end">
            <button
              type="button"
              onClick={handleLeave}
              className="rounded-lg px-4 py-[10px] text-body-14-m text-grey-600 transition-colors hover:bg-grey-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDraftSave}
              disabled={!canSaveDraft}
              title={
                isUnpublished
                  ? '앱에 내보내지 않고 저장합니다.'
                  : '앱에는 지금 발행된 내용이 그대로 유지되고, 편집 중인 내용만 따로 보관합니다.'
              }
              className="rounded-lg border border-grey-300 bg-white px-5 py-[10px] text-body-14-b text-grey-700 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              임시 저장
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canPublish}
              title="공개 설정을 갱신합니다. CDN 캐시(60초) 만료 후 유저에게 반영됩니다."
              className="rounded-lg bg-primary-ui px-6 py-[10px] text-body-14-b text-white transition-colors hover:bg-primary-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? '저장 중' : '발행하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
