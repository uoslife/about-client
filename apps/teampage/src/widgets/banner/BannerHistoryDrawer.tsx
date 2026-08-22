'use client';
import { Text } from '@/shared/component/Text';
import { formatKstDateTime, type BannerVersion } from '@/entities/banners';
import { BannerDrawer } from './BannerDrawer';
import { BannerChip, bannerGhostButtonClass } from './BannerField';

interface BannerHistoryDrawerProps {
  versions: BannerVersion[];
  isLoading: boolean;
  isRollingBack: boolean;
  onClose: () => void;
  onRollback: (version: BannerVersion) => void;
}

/**
 * 되돌릴 버전을 고를 때 필요한 것은 바이트 수가 아니라 그 버전에 무엇이 들어
 * 있었나다. 서버가 최근 몇 개만 요약을 붙여 내려주므로 나머지는 시각만 보인다.
 */
export function BannerHistoryDrawer({
  versions,
  isLoading,
  isRollingBack,
  onClose,
  onRollback,
}: BannerHistoryDrawerProps) {
  return (
    <BannerDrawer
      title="발행 이력"
      description="되돌리기도 새 버전으로 쌓입니다. 되돌린 것을 다시 되돌릴 수 있습니다."
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={bannerGhostButtonClass}>
            닫기
          </button>
        </div>
      }
    >
      {isLoading ? (
        <Text variant="body-14-m" color="grey-600">
          불러오는 중입니다.
        </Text>
      ) : versions.length === 0 ? (
        <Text variant="body-14-m" color="grey-600">
          아직 발행 이력이 없습니다.
        </Text>
      ) : (
        <ul className="flex flex-col gap-2">
          {versions.map((version) => (
            <li
              key={version.versionId}
              className={`rounded-xl border px-5 py-4 ${
                version.isLatest ? 'border-primary-ui bg-primary-lighter-alt' : 'border-grey-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Text variant="body-14-b" color="grey-900" as="span">
                      {formatKstDateTime(version.lastModified ?? '')}
                    </Text>
                    {version.isLatest && <BannerChip tone="primary">현재</BannerChip>}
                    {version.summary?.publishedVersion !== null && version.summary?.publishedVersion !== undefined && (
                      <BannerChip>v{version.summary.publishedVersion}</BannerChip>
                    )}
                    {version.summary?.enabled === false && <BannerChip tone="danger">전체 중지</BannerChip>}
                  </div>

                  {version.summary ? (
                    <div className="mt-2 flex flex-col gap-1">
                      <Text variant="body-12-m" color="grey-700">
                        배너 {version.summary.bannerCount}개
                      </Text>
                      {version.summary.banners.map((line) => (
                        <Text key={line} variant="body-12-m" color="grey-600">
                          {line}
                        </Text>
                      ))}
                    </div>
                  ) : (
                    <Text variant="body-12-m" color="grey-500">
                      요약을 읽지 못한 버전입니다.
                    </Text>
                  )}
                </div>

                {!version.isLatest && (
                  <button
                    type="button"
                    disabled={isRollingBack}
                    onClick={() => onRollback(version)}
                    className={`${bannerGhostButtonClass} shrink-0`}
                  >
                    되돌리기
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </BannerDrawer>
  );
}
