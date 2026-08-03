'use client';
import { Text } from '@/shared/component/Text';
import type { FlagVersion } from '@/entities/flags';
import { formatKstDateTime } from '@/entities/flags';

interface AbTestHistoryProps {
  publicVersions: FlagVersion[];
  privateVersions: FlagVersion[];
  isLoading: boolean;
  isRollingBack: boolean;
  onBack: () => void;
  onRollback: (scope: 'public' | 'private', version: FlagVersion) => void;
}

interface VersionTableProps {
  scope: 'public' | 'private';
  title: string;
  caption: string;
  versions: FlagVersion[];
  isRollingBack: boolean;
  onRollback: (version: FlagVersion) => void;
}

/**
 * 되돌릴 버전을 고를 때 필요한 것은 바이트 수가 아니라 "그 버전에 뭐가 들어
 * 있었나" 다. 그래서 크기 컬럼을 없애고 요약(실험 수·상태·비율)을 보여준다.
 *
 * 요약만으로 판단이 안 되는 경우(과거 스키마, 정밀 비교)를 위해 S3 원본을
 * 그대로 내려받는 링크를 함께 둔다.
 */
function VersionTable({ scope, title, caption, versions, isRollingBack, onRollback }: VersionTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <Text variant="body-18-b" color="grey-900">
          {title}
        </Text>
        <Text variant="body-12-m" color="grey-600">
          {caption}
        </Text>
      </div>

      {versions.length === 0 ? (
        <div className="rounded-2xl border border-grey-200 px-6 py-10 text-center">
          <Text variant="body-14-m" color="grey-600">
            아직 발행 이력이 없습니다.
          </Text>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {versions.map((version) => (
            <li
              key={version.versionId}
              className={`rounded-2xl border px-5 py-4 ${
                version.isLatest ? 'border-primary-ui bg-[#F7FAFF]' : 'border-grey-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4 max-md:flex-col">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Text variant="body-14-b" color="grey-900" as="span">
                      {formatKstDateTime(version.lastModified ?? '')}
                    </Text>
                    {version.isLatest && (
                      <span className="rounded-full bg-primary-ui px-2 py-[2px] text-body-12-m text-white">현재</span>
                    )}
                    {version.summary?.manifestVersion !== null && version.summary?.manifestVersion !== undefined && (
                      <span
                        title="매니페스트 내부의 발행 카운터. 지표의 manifest_version 과 대조하는 값입니다."
                        className="rounded-full bg-grey-100 px-2 py-[2px] text-body-12-m text-grey-700"
                      >
                        v{version.summary.manifestVersion}
                      </span>
                    )}
                    {version.summary?.enabled === false && (
                      <span className="rounded-full bg-danger-lighter px-2 py-[2px] text-body-12-m text-danger-ui">
                        전체 중지
                      </span>
                    )}
                  </div>

                  {version.summary ? (
                    <div className="mt-2 flex flex-col gap-1">
                      <Text variant="body-12-m" color="grey-700">
                        실험 {version.summary.experimentCount}개
                        {version.summary.updatedBy ? ` · ${version.summary.updatedBy}` : ''}
                      </Text>
                      {version.summary.experiments.map((line) => (
                        <Text key={line} variant="body-12-m" color="grey-600">
                          {line}
                        </Text>
                      ))}
                      {version.summary.experimentCount === 0 && (
                        <Text variant="body-12-m" color="grey-500">
                          (빈 설정)
                        </Text>
                      )}
                    </div>
                  ) : (
                    <Text variant="body-12-m" color="grey-500" as="p">
                      요약을 읽지 못했습니다. 원본을 내려받아 확인하세요.
                    </Text>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <a
                    href={`/api/flags/object?scope=${scope}&versionId=${encodeURIComponent(version.versionId)}`}
                    className="text-body-12-m text-grey-600 hover:underline"
                    title="S3 에 저장된 원본 JSON 을 그대로 내려받습니다"
                  >
                    원본 내려받기
                  </a>
                  {!version.isLatest && (
                    <button
                      type="button"
                      disabled={isRollingBack}
                      onClick={() => onRollback(version)}
                      className="rounded-lg border border-grey-300 px-3 py-[6px] text-body-12-m text-grey-700 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      이 버전으로 되돌리기
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AbTestHistory({
  publicVersions,
  privateVersions,
  isLoading,
  isRollingBack,
  onBack,
  onRollback,
}: AbTestHistoryProps) {
  return (
    <div className="mx-auto w-full max-w-[880px]">
      {/* 뒤로 가기는 제목의 "부모 맥락" 이라 제목 위에 두고 무게를 낮춘다.
          테두리 버튼으로 제목 옆에 두면 시각적 무게가 제목과 같거나 더 커져
          무엇이 이 화면의 주제인지 흐려진다. */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="group -ml-1 mb-1 flex items-center gap-1 rounded px-1 py-0.5 text-body-14-m text-grey-600 transition-colors hover:text-grey-900"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          A/B 테스트 목록
        </button>
        <Text variant="title-24-b" color="grey-900">
          발행 이력
        </Text>
      </div>

      {isLoading ? (
        <Text variant="body-14-m" color="grey-600">
          불러오는 중입니다.
        </Text>
      ) : (
        <div className="flex flex-col gap-8">
          <VersionTable
            scope="public"
            title="공개 설정 (public)"
            caption="앱이 읽는 파일입니다. 되돌리면 CDN 캐시(60초) 만료 후 반영됩니다."
            versions={publicVersions}
            isRollingBack={isRollingBack}
            onRollback={(version) => onRollback('public', version)}
          />
          <VersionTable
            scope="private"
            title="운영 메타데이터 (private)"
            caption="담당자·메모 등 비공개 정보입니다. 앱에는 영향이 없습니다."
            versions={privateVersions}
            isRollingBack={isRollingBack}
            onRollback={(version) => onRollback('private', version)}
          />
        </div>
      )}
    </div>
  );
}
