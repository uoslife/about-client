'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'motion/react';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import {
  BannersApiError,
  EMPTY_PRIVATE_DOC,
  bannerVersionsQueryOptions,
  bannersQueryOptions,
  nowIso,
  placementEntries,
  removeBanner,
  removePlacement,
  removeVariable,
  reorderWithinSlots,
  terminateBanner,
  upsertBanner,
  upsertPlacement,
  upsertVariable,
  type Banner,
  type BannerIssue,
  type BannerVariable,
  type BannerVersion,
  type DraftPrivateDoc,
  type Placement,
} from '@/entities/banners';
import { useRollbackBanners, useSaveBanners } from '@/features/banners';
import { BannerFormDrawer } from './BannerFormDrawer';
import { BannerHistoryDrawer } from './BannerHistoryDrawer';
import { BannerList } from './BannerList';
import { PlacementDrawer } from './PlacementDrawer';
import { VariableDrawer } from './VariableDrawer';

type View =
  | { type: 'list' }
  | { type: 'form'; bannerKey: string | null; sourceId: string | null }
  | { type: 'placements' }
  | { type: 'variables' }
  | { type: 'history' };

/** 상태 판정이 시각에 달려 있어 화면을 주기적으로 다시 계산한다. */
const CLOCK_INTERVAL_MS = 30_000;

export function BannerSection() {
  const [view, setView] = useState<View>({ type: 'list' });
  const [scope, setScope] = useState<string>('');
  const [order, setOrder] = useState<string[] | null>(null);
  const [formIssues, setFormIssues] = useState<BannerIssue[]>([]);
  const [now, setNow] = useState(() => new Date());

  const { toast } = useToast();
  const { open: openConfirmModal } = useConfirmModal();

  const { data, isLoading, isError, error } = useQuery(bannersQueryOptions());
  const versionsQuery = useQuery({ ...bannerVersionsQueryOptions(), enabled: view.type === 'history' });

  const saveBanners = useSaveBanners();
  const rollbackBanners = useRollbackBanners();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), CLOCK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const doc: DraftPrivateDoc = data?.doc ?? EMPTY_PRIVATE_DOC;
  const etag = data?.etag ?? null;

  // 구좌 하나가 항상 선택돼 있어야 한다. 문서가 늦게 오거나 보던 구좌가 사라지면 첫 구좌로.
  useEffect(() => {
    if (scope && doc.placements[scope]) return;
    const [first] = placementEntries(doc);
    setScope(first?.[0] ?? '');
  }, [doc, scope]);

  /**
   * 문서 전체를 발행한다.
   *
   * ETag 는 GET·저장 응답이 캐시에 넣어 둔 것을 그대로 실어 보낸다. 응답에는
   * 서버가 발급한 배너 id 와 새 ETag 가 들어 있고, useSaveBanners 가 캐시를
   * 갈아끼우므로 다음 저장은 곧바로 이어서 할 수 있다.
   */
  const publish = (next: DraftPrivateDoc, message: string, onDone?: () => void) => {
    setFormIssues([]);
    saveBanners.mutate(
      { etag, doc: next },
      {
        onSuccess: () => {
          toast(message);
          onDone?.();
        },
        onError: (mutationError) => {
          if (mutationError instanceof BannersApiError) {
            // 409·400 은 폼을 닫지 않는다. 입력을 다시 만들게 하면 작업이 사라진다.
            if (mutationError.status === 409) {
              toast('다른 사람이 먼저 저장했습니다. 새로고침 후 다시 시도해주세요');
              return;
            }
            if (mutationError.issues.length > 0) {
              setFormIssues(mutationError.issues);
              toast(mutationError.message);
              return;
            }
          }
          toast(mutationError instanceof Error ? mutationError.message : '저장에 실패했습니다.');
        },
      },
    );
  };

  const closeDrawer = () => {
    setFormIssues([]);
    setView({ type: 'list' });
  };

  const handleSaveBanner = (key: string, banner: Banner) =>
    publish(upsertBanner(doc, key, banner), '배너가 발행되었습니다.', closeDrawer);

  const handleTerminate = (id: string) =>
    openConfirmModal({
      title: '이 배너의 게시를 지금 종료하시겠습니까?',
      description: '종료 즉시 앱에서 더 이상 노출되지 않습니다.',
      confirmText: '종료',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => publish(terminateBanner(doc, id, nowIso()), '배너 게시를 종료했습니다.', closeDrawer),
    });

  const handleDelete = (id: string) =>
    openConfirmModal({
      title: '예약된 배너를 삭제하시겠습니까?',
      description: '삭제된 배너는 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => publish(removeBanner(doc, id), '배너를 삭제했습니다.', closeDrawer),
    });

  const handleSaveOrder = () => {
    if (!order || !scope) return;
    publish(reorderWithinSlots(doc, scope, order), '노출 순서를 저장했습니다.', () => setOrder(null));
  };

  const handleSavePlacement = (id: string, placement: Placement) =>
    publish(upsertPlacement(doc, id, placement), '구좌를 저장했습니다.');

  const handleDeletePlacement = (id: string) =>
    openConfirmModal({
      title: `'${doc.placements[id]?.name ?? id}' 구좌를 삭제하시겠습니까?`,
      description: '배너가 남아 있으면 삭제할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () =>
        publish(removePlacement(doc, id), '구좌를 삭제했습니다.', () => {
          if (scope === id) setScope('');
        }),
    });

  const handleSaveVariable = (key: string, variable: BannerVariable) =>
    publish(upsertVariable(doc, key, variable), '변수를 저장했습니다.');

  const handleDeleteVariable = (key: string) =>
    openConfirmModal({
      title: `'${doc.variables[key]?.label ?? key}' 변수를 삭제하시겠습니까?`,
      description: '조건으로 쓰고 있는 배너가 있으면 삭제할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => publish(removeVariable(doc, key), '변수를 삭제했습니다.'),
    });

  const handleRollback = (version: BannerVersion) =>
    openConfirmModal({
      title: '이 버전으로 되돌리시겠습니까?',
      description: '앱이 읽는 배너 목록이 즉시 바뀝니다. CDN 캐시(60초) 만료 후 반영됩니다.',
      confirmText: '되돌리기',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () =>
        rollbackBanners.mutate(
          { versionId: version.versionId },
          {
            onSuccess: () => toast('해당 버전으로 되돌렸습니다.'),
            onError: (rollbackError) =>
              toast(rollbackError instanceof Error ? rollbackError.message : '되돌리기에 실패했습니다.'),
          },
        ),
    });

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
        {error instanceof Error ? error.message : '배너를 불러오지 못했습니다.'}
      </Text>
    );
  }

  const source = view.type === 'form' && view.sourceId ? doc.banners[view.sourceId] : undefined;

  return (
    <>
      <BannerList
        doc={doc}
        publicLastModified={data?.publicLastModified ?? null}
        now={now}
        scope={scope}
        onScopeChange={(next) => {
          setScope(next);
          setOrder(null);
        }}
        order={order}
        onOrderChange={setOrder}
        onOrderReset={() => setOrder(null)}
        onOrderSave={handleSaveOrder}
        isSaving={saveBanners.isPending}
        onCreate={() => setView({ type: 'form', bannerKey: null, sourceId: null })}
        onOpen={(id) => setView({ type: 'form', bannerKey: id, sourceId: null })}
        onClone={(id) => setView({ type: 'form', bannerKey: null, sourceId: id })}
        onTerminate={handleTerminate}
        onDelete={handleDelete}
        onOpenPlacements={() => setView({ type: 'placements' })}
        onOpenVariables={() => setView({ type: 'variables' })}
        onOpenHistory={() => setView({ type: 'history' })}
      />

      {/* 서랍은 언마운트로 닫힌다. 닫힘 전환을 보려면 AnimatePresence 가 필요하고,
          복제처럼 서랍이 곧바로 갈리는 경우 겹치지 않게 wait 로 이어 붙인다. */}
      <AnimatePresence mode="wait">
        {view.type === 'form' && (
          <BannerFormDrawer
            key={view.bannerKey ?? view.sourceId ?? 'new'}
            doc={doc}
            bannerKey={view.bannerKey}
            source={source ? { ...source, terminatedAt: null } : null}
            now={now}
            isSaving={saveBanners.isPending}
            serverIssues={formIssues}
            onClose={closeDrawer}
            onSave={handleSaveBanner}
            onClone={() => setView({ type: 'form', bannerKey: null, sourceId: view.bannerKey })}
          />
        )}

        {view.type === 'placements' && (
          <PlacementDrawer
            key="placements"
            doc={doc}
            isSaving={saveBanners.isPending}
            onClose={closeDrawer}
            onSave={handleSavePlacement}
            onDelete={handleDeletePlacement}
          />
        )}

        {view.type === 'variables' && (
          <VariableDrawer
            key="variables"
            doc={doc}
            isSaving={saveBanners.isPending}
            onClose={closeDrawer}
            onSave={handleSaveVariable}
            onDelete={handleDeleteVariable}
          />
        )}

        {view.type === 'history' && (
          <BannerHistoryDrawer
            key="history"
            versions={versionsQuery.data?.versions ?? []}
            isLoading={versionsQuery.isLoading}
            isRollingBack={rollbackBanners.isPending}
            onClose={closeDrawer}
            onRollback={handleRollback}
          />
        )}
      </AnimatePresence>
    </>
  );
}
