'use client';
import { useState } from 'react';
import { Text } from '@/shared/component/Text';
import {
  placementEntries,
  placementIdSchema,
  placementUsage,
  type DraftPrivateDoc,
  type Placement,
} from '@/entities/banners';
import { BannerDrawer } from './BannerDrawer';
import {
  BannerField,
  BannerLockedBadge,
  bannerDangerButtonClass,
  bannerGhostButtonClass,
  bannerInputClass,
  bannerPrimaryButtonClass,
  bannerReadOnlyClass,
} from './BannerField';

interface PlacementDrawerProps {
  doc: DraftPrivateDoc;
  isSaving: boolean;
  onClose: () => void;
  onSave: (id: string, placement: Placement) => void;
  onDelete: (id: string) => void;
}

interface DraftState {
  id: string;
  isNew: boolean;
  name: string;
  width: string;
  height: string;
  maxKb: string;
}

const emptyDraft = (): DraftState => ({ id: '', isNew: true, name: '', width: '', height: '', maxKb: '300' });

const toDraft = (id: string, placement: Placement): DraftState => ({
  id,
  isNew: false,
  name: placement.name,
  width: String(placement.recommendedSize.width),
  height: String(placement.recommendedSize.height),
  maxKb: String(Math.round(placement.maxBytes / 1024)),
});

export function PlacementDrawer({ doc, isSaving, onClose, onSave, onDelete }: PlacementDrawerProps) {
  const [draft, setDraft] = useState<DraftState | null>(null);
  const entries = placementEntries(doc);

  const errors = draft
    ? {
        id: (() => {
          if (!draft.isNew) return null;
          const parsed = placementIdSchema.safeParse(draft.id);
          if (!parsed.success) return parsed.error.issues[0]?.message ?? '구좌 ID를 확인해주세요.';
          if (doc.placements[draft.id]) return '이미 사용 중인 구좌 ID입니다.';
          return null;
        })(),
        name: draft.name.trim() ? null : '구좌 이름을 입력해주세요.',
        size:
          Number(draft.width) > 0 && Number(draft.height) > 0 ? null : '권장 크기를 1 이상의 숫자로 입력해주세요.',
        maxKb: Number(draft.maxKb) > 0 ? null : '최대 용량을 1KB 이상으로 입력해주세요.',
      }
    : null;

  const errorCount = errors ? Object.values(errors).filter(Boolean).length : 0;

  const handleSave = () => {
    if (!draft || errorCount > 0) return;
    onSave(draft.id, {
      name: draft.name.trim(),
      navOrder: doc.placements[draft.id]?.navOrder ?? entries.length,
      recommendedSize: { width: Number(draft.width), height: Number(draft.height) },
      maxBytes: Number(draft.maxKb) * 1024,
    });
    setDraft(null);
  };

  return (
    <BannerDrawer
      title="구좌 관리"
      description="배너가 놓이는 자리입니다. 이미지의 권장 비율과 용량 제한을 여기서 정합니다."
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={bannerGhostButtonClass}>
            닫기
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {entries.length === 0 && (
          <Text variant="body-14-m" color="grey-600">
            아직 구좌가 없습니다. 구좌를 하나 만들어야 배너를 등록할 수 있습니다.
          </Text>
        )}

        <ul className="flex flex-col gap-2">
          {entries.map(([id, placement]) => {
            const usage = placementUsage(doc, id);
            return (
              <li key={id} className="flex items-center justify-between gap-3 rounded-xl border border-grey-200 px-4 py-3">
                <div className="min-w-0">
                  <Text variant="body-14-b" color="grey-900">
                    {placement.name}
                  </Text>
                  <Text variant="body-12-m" color="grey-600">
                    {id} · {placement.recommendedSize.width}×{placement.recommendedSize.height} ·{' '}
                    {Math.round(placement.maxBytes / 1024)}KB · 배너 {usage}개
                  </Text>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => setDraft(toDraft(id, placement))} className={bannerGhostButtonClass}>
                    수정
                  </button>
                  <button
                    type="button"
                    disabled={usage > 0 || isSaving}
                    title={usage > 0 ? '배너가 남아 있어 삭제할 수 없습니다.' : undefined}
                    onClick={() => onDelete(id)}
                    className={bannerDangerButtonClass}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {draft ? (
          <div className="flex flex-col gap-5 rounded-xl border border-grey-200 p-5">
            <Text variant="body-16-b" color="grey-900">
              {draft.isNew ? '구좌 추가' : '구좌 수정'}
            </Text>

            <BannerField
              label="구좌 ID"
              required
              htmlFor="placement-id"
              aside={draft.isNew ? undefined : <BannerLockedBadge reason="배너와 매니페스트가 참조하는 키입니다." />}
              hint="영문 소문자로 시작하고 소문자·숫자·언더스코어만 씁니다."
              error={errors?.id}
            >
              <input
                id="placement-id"
                type="text"
                value={draft.id}
                readOnly={!draft.isNew}
                onChange={(event) => setDraft({ ...draft, id: event.target.value })}
                placeholder="home"
                className={draft.isNew ? bannerInputClass : bannerReadOnlyClass}
              />
            </BannerField>

            <BannerField label="구좌 이름" required htmlFor="placement-name" error={errors?.name}>
              <input
                id="placement-name"
                type="text"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="홈"
                className={bannerInputClass}
              />
            </BannerField>

            <BannerField label="권장 크기 (px)" required error={errors?.size}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  aria-label="권장 가로"
                  value={draft.width}
                  onChange={(event) => setDraft({ ...draft, width: event.target.value })}
                  className={`${bannerInputClass} max-w-[120px]`}
                />
                <Text variant="body-14-m" color="grey-600" as="span">
                  ×
                </Text>
                <input
                  type="number"
                  aria-label="권장 세로"
                  value={draft.height}
                  onChange={(event) => setDraft({ ...draft, height: event.target.value })}
                  className={`${bannerInputClass} max-w-[120px]`}
                />
              </div>
            </BannerField>

            <BannerField label="최대 용량 (KB)" required htmlFor="placement-max" error={errors?.maxKb}>
              <input
                id="placement-max"
                type="number"
                value={draft.maxKb}
                onChange={(event) => setDraft({ ...draft, maxKb: event.target.value })}
                className={`${bannerInputClass} max-w-[160px]`}
              />
            </BannerField>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDraft(null)} className={bannerGhostButtonClass}>
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={errorCount > 0 || isSaving}
                className={bannerPrimaryButtonClass}
              >
                {isSaving ? '저장 중' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setDraft(emptyDraft())} className={`${bannerGhostButtonClass} w-fit`}>
            ＋ 구좌 추가
          </button>
        )}
      </div>
    </BannerDrawer>
  );
}
