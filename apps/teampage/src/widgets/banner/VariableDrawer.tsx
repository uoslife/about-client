'use client';
import { useState } from 'react';
import { Text } from '@/shared/component/Text';
import {
  variableEntries,
  variableKeySchema,
  variableUsage,
  variableValueKeySchema,
  type BannerVariable,
  type DraftPrivateDoc,
} from '@/entities/banners';
import { BannerDrawer } from './BannerDrawer';
import {
  BannerChip,
  BannerField,
  BannerLockedBadge,
  bannerDangerButtonClass,
  bannerGhostButtonClass,
  bannerInputClass,
  bannerPrimaryButtonClass,
  bannerReadOnlyClass,
} from './BannerField';

interface VariableDrawerProps {
  doc: DraftPrivateDoc;
  isSaving: boolean;
  onClose: () => void;
  onSave: (key: string, variable: BannerVariable) => void;
  onDelete: (key: string) => void;
}

interface ValueDraft {
  key: string;
  label: string;
}

interface DraftState {
  key: string;
  isNew: boolean;
  label: string;
  unknownNote: string;
  values: ValueDraft[];
}

const emptyDraft = (): DraftState => ({
  key: '',
  isNew: true,
  label: '',
  unknownNote: '',
  values: [{ key: '', label: '' }],
});

const toDraft = (key: string, variable: BannerVariable): DraftState => ({
  key,
  isNew: false,
  label: variable.label,
  unknownNote: variable.unknownNote,
  values: variable.values.map((value) => ({ key: value.key, label: value.label })),
});

export function VariableDrawer({ doc, isSaving, onClose, onSave, onDelete }: VariableDrawerProps) {
  const [draft, setDraft] = useState<DraftState | null>(null);
  const entries = variableEntries(doc);

  const removedInUse = draft
    ? (doc.variables[draft.key]?.values ?? [])
        .filter((value) => !draft.values.some((item) => item.key === value.key))
        .filter((value) => variableUsage(doc, draft.key, value.key) > 0)
        .map((value) => value.label)
    : [];

  const errors = draft
    ? {
        key: (() => {
          if (!draft.isNew) return null;
          const parsed = variableKeySchema.safeParse(draft.key);
          if (!parsed.success) return parsed.error.issues[0]?.message ?? '변수 키를 확인해주세요.';
          if (doc.variables[draft.key]) return '이미 사용 중인 변수 키입니다.';
          return null;
        })(),
        label: draft.label.trim() ? null : '변수 라벨을 입력해주세요.',
        values: (() => {
          if (draft.values.length === 0) return '값이 최소 1개 필요합니다.';
          const parsedKeys = draft.values.map((value) => variableValueKeySchema.safeParse(value.key));
          const invalid = parsedKeys.find((parsed) => !parsed.success);
          if (invalid && !invalid.success) return invalid.error.issues[0]?.message ?? '값 키를 확인해주세요.';
          if (draft.values.some((value) => !value.label.trim())) return '값 이름을 입력해주세요.';
          const keys = draft.values.map((value) => value.key);
          if (new Set(keys).size !== keys.length) return '값 키가 중복되었습니다.';
          if (removedInUse.length > 0) return `${removedInUse.join(', ')} 값은 배너가 쓰고 있어 지울 수 없습니다.`;
          return null;
        })(),
      }
    : null;

  const errorCount = errors ? Object.values(errors).filter(Boolean).length : 0;

  const handleSave = () => {
    if (!draft || errorCount > 0) return;
    onSave(draft.key, {
      label: draft.label.trim(),
      order: doc.variables[draft.key]?.order ?? entries.length,
      unknownNote: draft.unknownNote.trim(),
      values: draft.values.map((value) => ({ key: value.key, label: value.label.trim() })),
    });
    setDraft(null);
  };

  return (
    <BannerDrawer
      title="변수 관리"
      description="노출 조건에 쓰이는 사용자 속성입니다."
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
        <div className="rounded-xl border border-grey-200 bg-grey-50 px-4 py-3">
          <Text variant="body-12-m" color="grey-700">
            매니페스트에는 키와 값 문자열만 나갑니다. 웹뷰 `CONDITION_REGISTRY` 에 같은 키의 resolver 가 구현돼야
            동작하며, 해석하지 못하는 변수가 걸린 배너는 아무에게도 노출되지 않습니다.
          </Text>
        </div>

        <ul className="flex flex-col gap-2">
          {entries.map(([key, variable]) => {
            const usage = variableUsage(doc, key);
            return (
              <li key={key} className="flex items-start justify-between gap-3 rounded-xl border border-grey-200 px-4 py-3">
                <div className="min-w-0">
                  <Text variant="body-14-b" color="grey-900">
                    {variable.label}
                  </Text>
                  <Text variant="body-12-m" color="grey-600">
                    {key} · 배너 {usage}개
                  </Text>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {variable.values.map((value) => (
                      <BannerChip key={value.key}>{value.label}</BannerChip>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => setDraft(toDraft(key, variable))} className={bannerGhostButtonClass}>
                    수정
                  </button>
                  <button
                    type="button"
                    disabled={usage > 0 || isSaving}
                    title={usage > 0 ? '배너가 조건으로 쓰고 있어 삭제할 수 없습니다.' : undefined}
                    onClick={() => onDelete(key)}
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
              {draft.isNew ? '변수 추가' : '변수 수정'}
            </Text>

            <BannerField
              label="변수 키"
              required
              htmlFor="variable-key"
              aside={draft.isNew ? undefined : <BannerLockedBadge reason="배너 조건과 웹뷰 resolver 가 참조합니다." />}
              hint="웹뷰 CONDITION_REGISTRY 의 키와 같아야 합니다."
              error={errors?.key}
            >
              <input
                id="variable-key"
                type="text"
                value={draft.key}
                readOnly={!draft.isNew}
                onChange={(event) => setDraft({ ...draft, key: event.target.value })}
                placeholder="grade"
                className={draft.isNew ? bannerInputClass : bannerReadOnlyClass}
              />
            </BannerField>

            <BannerField label="변수 이름" required htmlFor="variable-label" error={errors?.label}>
              <input
                id="variable-label"
                type="text"
                value={draft.label}
                onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                placeholder="학년"
                className={bannerInputClass}
              />
            </BannerField>

            <BannerField
              label="값 미상 설명"
              htmlFor="variable-unknown"
              hint="배너 폼의 '값 미상' 아래에 그대로 표시됩니다."
            >
              <input
                id="variable-unknown"
                type="text"
                value={draft.unknownNote}
                onChange={(event) => setDraft({ ...draft, unknownNote: event.target.value })}
                placeholder="학년을 입력하지 않은 사용자"
                className={bannerInputClass}
              />
            </BannerField>

            <BannerField label="값 목록" required hint="'값 미상'은 자동으로 제공되므로 여기에 넣지 않습니다." error={errors?.values}>
              <div className="flex flex-col gap-2">
                {draft.values.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      aria-label="값 키"
                      value={value.key}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          values: draft.values.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, key: event.target.value } : item,
                          ),
                        })
                      }
                      placeholder="1"
                      className={`${bannerInputClass} max-w-[140px]`}
                    />
                    <input
                      type="text"
                      aria-label="값 이름"
                      value={value.label}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          values: draft.values.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, label: event.target.value } : item,
                          ),
                        })
                      }
                      placeholder="1학년"
                      className={bannerInputClass}
                    />
                    <button
                      type="button"
                      aria-label="값 삭제"
                      onClick={() =>
                        setDraft({ ...draft, values: draft.values.filter((_, itemIndex) => itemIndex !== index) })
                      }
                      className="rounded px-2 py-1 text-body-14-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-danger-ui"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, values: [...draft.values, { key: '', label: '' }] })}
                  className={`${bannerGhostButtonClass} w-fit`}
                >
                  ＋ 값 추가
                </button>
              </div>
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
            ＋ 변수 추가
          </button>
        )}
      </div>
    </BannerDrawer>
  );
}
