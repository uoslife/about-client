'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import type { FlagVersion, MergedExperiment } from '@/entities/flags';
import {
  EMPTY_BUNDLE,
  FlagsApiError,
  flagVersionsQueryOptions,
  flagsQueryOptions,
  removeExperiment,
  upsertExperiment,
} from '@/entities/flags';
import { useRollbackFlags, useSaveFlags } from '@/features/flags';
import { AbTestEditor } from './AbTestEditor';
import { AbTestHistory } from './AbTestHistory';
import { AbTestList } from './AbTestList';

type View = { type: 'list' } | { type: 'edit'; experimentId: string } | { type: 'create' } | { type: 'history' };

export function AbTestSection() {
  const [view, setView] = useState<View>({ type: 'list' });
  const { toast } = useToast();
  const { open: openConfirmModal } = useConfirmModal();

  const { data, isLoading, isError, error } = useQuery(flagsQueryOptions());
  // 이력은 그 화면에 들어갔을 때만 읽는다 — enabled 는 화면 사정이므로 여기서 붙인다.
  const versionsQuery = useQuery({ ...flagVersionsQueryOptions(), enabled: view.type === 'history' });

  const saveFlags = useSaveFlags();
  const rollbackFlags = useRollbackFlags();

  const bundle = data?.bundle ?? EMPTY_BUNDLE;
  const etags = data?.etags ?? { public: null, private: null };

  const handleSave = (mode: 'draft' | 'publish', experimentId: string, experiment: MergedExperiment) => {
    saveFlags.mutate(
      { mode, etags, bundle: upsertExperiment(bundle, experimentId, experiment) },
      {
        onSuccess: () => {
          toast(mode === 'draft' ? '초안이 저장되었습니다.' : '발행이 완료되었습니다.');
          setView({ type: 'list' });
        },
        onError: (mutationError) => {
          // 409는 폼 상태를 유지한 채 안내만 한다.
          if (mutationError instanceof FlagsApiError && mutationError.status === 409) {
            toast('다른 사람이 먼저 저장했습니다. 새로고침 후 다시 시도해주세요');
            return;
          }
          toast(mutationError instanceof Error ? mutationError.message : '저장에 실패했습니다.');
        },
      },
    );
  };

  /**
   * 삭제.
   *
   * 별도 삭제 API 가 없다. 번들에서 빼고 발행하면 public·private 두 문서가 그
   * 실험 없이 다시 기록된다. S3 오브젝트를 지우는 게 아니라 덮어쓰므로 버킷
   * versioning 에 남아 발행 이력에서 되돌릴 수 있다.
   */
  const handleDelete = (experimentId: string, experiment: MergedExperiment) => {
    openConfirmModal({
      title: `'${experiment.campaignName || experimentId}' 실험을 삭제하시겠습니까?`,
      description: (
        <div className="flex flex-col gap-2 text-left">
          <p>공개 설정과 운영 메타데이터에서 함께 제거됩니다. 캠페인명·담당자·기획서 링크·메모도 사라집니다.</p>
          {!experiment.isDraft && (
            <p className="font-bold">
              배포된 앱은 이 실험을 찾지 못해 모든 유저가 기본 화면을 보게 됩니다. 최대 60초 안에 반영됩니다.
            </p>
          )}
          {experiment.status === 'running' && !experiment.isDraft && (
            <p className="font-bold">
              현재 실행 중인 실험입니다. 삭제한 시점 이후로는 지표가 쌓이지 않아 분석 구간이 끊깁니다.
            </p>
          )}
          <p className="text-grey-600">
            발행 이력에는 남습니다. 실수로 지웠다면 이전 버전으로 되돌릴 수 있습니다.
          </p>
        </div>
      ),
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => {
        saveFlags.mutate(
          { mode: 'publish', etags, bundle: removeExperiment(bundle, experimentId) },
          {
            onSuccess: () => {
              toast('실험이 삭제되었습니다.');
              setView({ type: 'list' });
            },
            onError: (mutationError) => {
              if (mutationError instanceof FlagsApiError && mutationError.status === 409) {
                toast('다른 사람이 먼저 저장했습니다. 새로고침 후 다시 시도해주세요');
                return;
              }
              toast(mutationError instanceof Error ? mutationError.message : '삭제에 실패했습니다.');
            },
          },
        );
      },
    });
  };

  const handleRollback = (scope: 'public' | 'private', version: FlagVersion) => {
    openConfirmModal({
      title: scope === 'public' ? '이 버전으로 되돌리시겠습니까?' : '비공개 메타데이터를 되돌리시겠습니까?',
      description:
        scope === 'public'
          ? '앱이 읽는 공개 설정이 즉시 바뀝니다. CDN 캐시(60초) 만료 후 유저에게 반영됩니다.'
          : '담당자/메모 등 운영 메타데이터만 되돌립니다.',
      confirmText: '되돌리기',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => {
        rollbackFlags.mutate(
          { scope, versionId: version.versionId },
          {
            onSuccess: () => toast('해당 버전으로 되돌렸습니다.'),
            onError: (rollbackError) =>
              toast(rollbackError instanceof Error ? rollbackError.message : '되돌리기에 실패했습니다.'),
          },
        );
      },
    });
  };

  if (isLoading) {
    return (
      <Text variant="body-16-m" color="grey-600">
        불러오는 중입니다.
      </Text>
    );
  }

  if (isError) {
    return (
      <Text variant="body-16-m" color="grey-600">
        {error instanceof Error ? error.message : '설정을 불러오지 못했습니다.'}
      </Text>
    );
  }

  if (view.type === 'history') {
    return (
      <AbTestHistory
        publicVersions={versionsQuery.data?.public ?? []}
        privateVersions={versionsQuery.data?.private ?? []}
        isLoading={versionsQuery.isLoading}
        isRollingBack={rollbackFlags.isPending}
        onBack={() => setView({ type: 'list' })}
        onRollback={handleRollback}
      />
    );
  }

  if (view.type === 'create' || view.type === 'edit') {
    const experimentId = view.type === 'edit' ? view.experimentId : '';
    return (
      <AbTestEditor
        key={experimentId || '__new__'}
        experimentId={experimentId}
        original={view.type === 'edit' ? bundle.experiments[view.experimentId] : undefined}
        existingIds={Object.keys(bundle.experiments)}
        isSaving={saveFlags.isPending}
        onCancel={() => setView({ type: 'list' })}
        onSave={handleSave}
        onDelete={view.type === 'edit' ? handleDelete : undefined}
      />
    );
  }

  return (
    <AbTestList
      bundle={bundle}
      publicLastModified={data?.publicLastModified ?? null}
      onCreate={() => setView({ type: 'create' })}
      onSelect={(experimentId) => setView({ type: 'edit', experimentId })}
      onOpenHistory={() => setView({ type: 'history' })}
    />
  );
}
