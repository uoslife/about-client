'use client';
import { useMemo, useRef, useState, type DragEvent } from 'react';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import {
  ASSET_MIME_EXTENSIONS,
  BANNER_STATE_LABEL,
  LANDING_TYPES,
  bannerImageUrl,
  bannerState,
  createDraftBannerKey,
  isoToKstLocal,
  kstLocalToIso,
  nextPosition,
  nowIso,
  placementEntries,
  type Banner,
  type BannerImage,
  type BannerIssue,
  type DraftPrivateDoc,
  type LandingType,
} from '@/entities/banners';
import { useUploadBannerAsset } from '@/features/banners';
import { BannerConditionEditor, type ConditionRow } from './BannerConditionEditor';
import { BannerDrawer } from './BannerDrawer';
import {
  BannerField,
  BannerLockedBadge,
  bannerGhostButtonClass,
  bannerInputClass,
  bannerInputErrorClass,
  bannerPrimaryButtonClass,
  bannerReadOnlyClass,
} from './BannerField';
import { BannerPreview } from './BannerPreview';

interface BannerFormDrawerProps {
  doc: DraftPrivateDoc;
  /** 수정 대상 키. 신규·복제면 null */
  bannerKey: string | null;
  /** 복제 원본. 신규면 null */
  source: Banner | null;
  now: Date;
  isSaving: boolean;
  /** 400 응답의 issues. path 로 필드를 찾는다. */
  serverIssues: BannerIssue[];
  onClose: () => void;
  onSave: (key: string, banner: Banner) => void;
  onClone: () => void;
}

type LandingMode = LandingType | 'none';

const ACCEPT = Object.keys(ASSET_MIME_EXTENSIONS).join(',');

const LANDING_LABEL: Record<LandingMode, string> = { inapp: '인앱', external: '외부', none: '없음' };

const toRows = (banner: Banner | null): ConditionRow[] =>
  Object.entries(banner?.conditions ?? {}).map(([variableKey, values]) => ({ variableKey, values: values ?? [] }));

const formatKb = (bytes: number) => `${Math.round(bytes / 1024)}KB`;

export function BannerFormDrawer({
  doc,
  bannerKey,
  source,
  now,
  isSaving,
  serverIssues,
  onClose,
  onSave,
  onClone,
}: BannerFormDrawerProps) {
  const { toast } = useToast();
  const uploadAsset = useUploadBannerAsset();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const original = bannerKey ? (doc.banners[bannerKey] ?? null) : null;
  const base = original ?? source;
  const state = original ? bannerState(original, now) : null;
  const isReadOnly = state === 'ended';
  const isLive = state === 'live';

  /** 신규 배너의 키. 서버가 `bn_` id 를 발급할 때까지만 쓰인다. */
  const key = useMemo(() => bannerKey ?? createDraftBannerKey(), [bannerKey]);

  const [image, setImage] = useState<BannerImage | null>(base?.image ?? null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [name, setName] = useState(base?.name ?? '');
  const [placement, setPlacement] = useState(base?.placement ?? '');
  const [landingMode, setLandingMode] = useState<LandingMode>(base?.landing?.type ?? 'none');
  const [landingUrl, setLandingUrl] = useState(base?.landing?.url ?? '');
  const [publishMode, setPublishMode] = useState<'now' | 'scheduled'>(original ? 'scheduled' : 'now');
  const [startLocal, setStartLocal] = useState(isoToKstLocal(base?.startAt ?? ''));
  const [endLocal, setEndLocal] = useState(isoToKstLocal(base?.scheduledEndAt ?? ''));
  const [conditionMode, setConditionMode] = useState<'all' | 'custom'>(
    Object.keys(base?.conditions ?? {}).length > 0 ? 'custom' : 'all',
  );
  const [rows, setRows] = useState<ConditionRow[]>(toRows(base));

  const placements = placementEntries(doc);
  const selectedPlacement = doc.placements[placement];
  const previewUrl = uploadedUrl || (image ? bannerImageUrl(image.key) : '');

  const startAt = isLive && original ? original.startAt : publishMode === 'now' ? nowIso() : kstLocalToIso(startLocal);
  const scheduledEndAt = kstLocalToIso(endLocal);

  const fieldErrors = {
    image: image ? null : '배너 이미지를 등록해주세요.',
    name: name.trim() ? null : '배너명을 입력해주세요.',
    placement: placement ? null : '구좌를 선택해주세요.',
    landing: (() => {
      if (landingMode === 'none') return null;
      if (!landingUrl.trim()) return '이동 링크 주소를 입력해주세요.';
      if (landingMode === 'external' && !/^https?:\/\/.+/.test(landingUrl.trim()))
        return '외부 링크는 http(s):// 로 시작하는 주소여야 합니다.';
      return null;
    })(),
    schedule: (() => {
      if (publishMode === 'scheduled' && !startLocal && !isLive) return '게시 시작 일시를 입력해주세요.';
      if (!endLocal) return '게시 종료 일시를 입력해주세요.';
      if (Date.parse(startAt) >= Date.parse(scheduledEndAt)) return '종료 일시는 시작 일시보다 뒤여야 합니다.';
      return null;
    })(),
    conditions: (() => {
      if (conditionMode === 'all') return null;
      if (rows.length === 0) return '조건을 추가하거나 전체 노출을 선택해주세요.';
      if (rows.some((row) => !row.variableKey)) return '변수를 선택해주세요.';
      if (rows.some((row) => row.values.length === 0)) return '조건마다 값을 하나 이상 선택해주세요.';
      return null;
    })(),
  };

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  /** 서버가 알려준 오류를 같은 필드 아래에 붙인다. */
  const serverErrorOf = (field: string) =>
    serverIssues.find((issue) => issue.path === `banners.${key}.${field}` || issue.path.endsWith(`.${field}`))?.message ??
    null;

  const unmatchedIssues = serverIssues.filter(
    (issue) => !['image', 'name', 'placement', 'landing', 'startAt', 'scheduledEndAt', 'conditions'].some((field) =>
      issue.path.endsWith(`.${field}`),
    ),
  );

  const errorOf = (field: keyof typeof fieldErrors, serverField = field as string) =>
    fieldErrors[field] ?? serverErrorOf(serverField);

  const handleUpload = (file: File | undefined) => {
    if (!file || !placement) return;
    uploadAsset.mutate(
      { file, placement },
      {
        onSuccess: (asset) => {
          setImage(asset);
          setUploadedUrl(URL.createObjectURL(file));
        },
        onError: (error) => toast(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.'),
      },
    );
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isReadOnly || !placement) return;
    handleUpload(event.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (errorCount > 0 || !image) return;
    onSave(key, {
      name: name.trim(),
      placement,
      position: original?.position ?? nextPosition(doc, placement),
      image,
      landing: landingMode === 'none' ? null : { type: landingMode, url: landingUrl.trim() },
      conditions:
        conditionMode === 'all'
          ? {}
          : Object.fromEntries(rows.map((row) => [row.variableKey, row.values])),
      startAt,
      scheduledEndAt,
      terminatedAt: original?.terminatedAt ?? null,
      createdBy: original?.createdBy ?? '',
      createdAt: original?.createdAt ?? '',
      updatedBy: original?.updatedBy ?? '',
      updatedAt: original?.updatedAt ?? '',
    });
  };

  const footer = isReadOnly ? (
    <div className="flex items-center justify-end gap-3">
      <button type="button" onClick={onClose} className={bannerGhostButtonClass}>
        닫기
      </button>
      <button type="button" onClick={onClone} className={bannerPrimaryButtonClass}>
        복제해서 새로 등록
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-between gap-4">
      <Text variant="body-12-m" color={errorCount > 0 ? 'danger-ui' : 'grey-600'}>
        {errorCount > 0 ? `입력을 확인해주세요 · ${errorCount}건` : '저장하면 곧바로 발행됩니다.'}
      </Text>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onClose} className={bannerGhostButtonClass}>
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={errorCount > 0 || isSaving}
          className={bannerPrimaryButtonClass}
        >
          {isSaving ? '저장 중' : '저장하고 발행'}
        </button>
      </div>
    </div>
  );

  return (
    <BannerDrawer
      title={original ? (isReadOnly ? '배너 상세' : '배너 수정') : '배너 등록'}
      description={state ? BANNER_STATE_LABEL[state] : '저장하면 즉시 발행됩니다.'}
      width="wide"
      footer={footer}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6">
        {unmatchedIssues.length > 0 && (
          <div className="rounded-xl border border-danger-ui bg-danger-lighter px-4 py-3">
            {unmatchedIssues.map((issue) => (
              <Text key={`${issue.path}-${issue.message}`} variant="body-12-m" color="danger-ui">
                {issue.message}
              </Text>
            ))}
          </div>
        )}

        <BannerField
          label="구좌"
          required
          htmlFor="banner-placement"
          aside={isLive ? <BannerLockedBadge reason="게시가 시작된 뒤에는 구좌를 옮길 수 없습니다." /> : undefined}
          hint="이미지의 권장 크기와 용량 제한이 구좌에서 옵니다."
          error={errorOf('placement')}
        >
          <div className="flex flex-wrap gap-3">
            {placements.map(([id, item]) => (
              <label key={id} className="flex items-center gap-2 text-body-14-m text-grey-800">
                <input
                  type="radio"
                  name="banner-placement"
                  value={id}
                  disabled={isReadOnly || isLive}
                  checked={placement === id}
                  onChange={() => {
                    setPlacement(id);
                    setImage(null);
                    setUploadedUrl('');
                  }}
                />
                {item.name}
              </label>
            ))}
          </div>
        </BannerField>

        <BannerField
          label="배너 이미지"
          required
          hint={
            selectedPlacement
              ? `WebP 권장 · ${selectedPlacement.recommendedSize.width}×${selectedPlacement.recommendedSize.height} · 최대 ${formatKb(selectedPlacement.maxBytes)}`
              : '구좌를 먼저 선택해주세요. 비율·용량 기준이 구좌 정의에서 옵니다.'
          }
          error={errorOf('image')}
        >
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className={`flex flex-col items-start gap-3 rounded-xl border border-dashed px-5 py-6 ${
              placement && !isReadOnly ? 'border-grey-300' : 'border-grey-200 bg-grey-50'
            }`}
          >
            {image ? (
              <Text variant="body-12-m" color="grey-700">
                {image.originalName || image.key} · {image.width}×{image.height} · {formatKb(image.bytes)}
              </Text>
            ) : (
              <Text variant="body-12-m" color="grey-600">
                이미지를 끌어다 놓거나 파일을 선택하세요.
              </Text>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
            <button
              type="button"
              disabled={!placement || isReadOnly || uploadAsset.isPending}
              onClick={() => fileInputRef.current?.click()}
              className={bannerGhostButtonClass}
            >
              {uploadAsset.isPending ? '업로드 중' : image ? '이미지 교체' : '파일 선택'}
            </button>
          </div>
        </BannerField>

        <BannerField label="배너명" required htmlFor="banner-name" error={errorOf('name')}>
          <input
            id="banner-name"
            type="text"
            value={name}
            readOnly={isReadOnly}
            onChange={(event) => setName(event.target.value)}
            placeholder="이루매런 이벤트"
            className={isReadOnly ? bannerReadOnlyClass : errorOf('name') ? bannerInputErrorClass : bannerInputClass}
          />
        </BannerField>

        <BannerField label="이동 링크" error={errorOf('landing')}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              {([...LANDING_TYPES, 'none'] as LandingMode[]).map((mode) => (
                <label key={mode} className="flex items-center gap-2 text-body-14-m text-grey-800">
                  <input
                    type="radio"
                    name="banner-landing"
                    disabled={isReadOnly}
                    checked={landingMode === mode}
                    onChange={() => setLandingMode(mode)}
                  />
                  {LANDING_LABEL[mode]}
                </label>
              ))}
            </div>
            {landingMode !== 'none' && (
              <input
                type="text"
                value={landingUrl}
                readOnly={isReadOnly}
                onChange={(event) => setLandingUrl(event.target.value)}
                placeholder={landingMode === 'inapp' ? '/notice/12' : 'https://'}
                className={isReadOnly ? bannerReadOnlyClass : bannerInputClass}
              />
            )}
          </div>
        </BannerField>

        <BannerField
          label="게시"
          required
          aside={isLive ? <BannerLockedBadge reason="게시 중에는 시작 일시를 바꿀 수 없습니다." /> : undefined}
          hint="KST 기준으로 저장됩니다."
          error={errorOf('schedule', 'scheduledEndAt') ?? serverErrorOf('startAt')}
        >
          <div className="flex flex-col gap-3">
            {!isLive && (
              <div className="flex gap-3">
                {(['now', 'scheduled'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2 text-body-14-m text-grey-800">
                    <input
                      type="radio"
                      name="banner-publish"
                      disabled={isReadOnly}
                      checked={publishMode === mode}
                      onChange={() => setPublishMode(mode)}
                    />
                    {mode === 'now' ? '즉시 게시' : '예약 게시'}
                  </label>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="datetime-local"
                aria-label="게시 시작 일시"
                value={isLive && original ? isoToKstLocal(original.startAt) : startLocal}
                readOnly={isReadOnly || isLive}
                disabled={publishMode === 'now' && !isLive}
                onChange={(event) => setStartLocal(event.target.value)}
                className={`${isReadOnly || isLive ? bannerReadOnlyClass : bannerInputClass} max-w-[240px]`}
              />
              <Text variant="body-14-m" color="grey-600" as="span">
                →
              </Text>
              <input
                type="datetime-local"
                aria-label="게시 종료 일시"
                value={endLocal}
                readOnly={isReadOnly}
                onChange={(event) => setEndLocal(event.target.value)}
                className={`${isReadOnly ? bannerReadOnlyClass : bannerInputClass} max-w-[240px]`}
              />
            </div>
          </div>
        </BannerField>

        <BannerField label="노출 조건" error={errorOf('conditions')}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {(['all', 'custom'] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2 text-body-14-m text-grey-800">
                  <input
                    type="radio"
                    name="banner-condition"
                    disabled={isReadOnly}
                    checked={conditionMode === mode}
                    onChange={() => setConditionMode(mode)}
                  />
                  {mode === 'all' ? '전체' : '조건 지정'}
                </label>
              ))}
            </div>
            {conditionMode === 'custom' && (
              <BannerConditionEditor doc={doc} rows={rows} readOnly={isReadOnly} onChange={setRows} />
            )}
          </div>
        </BannerField>

        <div className="border-t border-grey-200 pt-6">
          <Text variant="body-14-b" color="grey-900" className="mb-3 text-center">
            모바일 미리보기
          </Text>
          <BannerPreview imageUrl={previewUrl} placement={selectedPlacement} name={name} />
        </div>
      </div>
    </BannerDrawer>
  );
}
