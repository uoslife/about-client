'use client';
import { Text } from '@/shared/component/Text';
import type { FlagsBundle } from '@/entities/flags';
import { bucketsToPercent, formatKstDateTime, isoToKstYmd } from '@/entities/flags';
import { AbTestStatusTag } from './AbTestStatusTag';

interface AbTestListProps {
  bundle: FlagsBundle;
  publicLastModified: string | null;
  onCreate: () => void;
  onSelect: (experimentId: string) => void;
  onOpenHistory: () => void;
}

const HEADERS = ['상태', '캠페인명', '실험 ID', '기간', '비율', '수정일'];

export function AbTestList({ bundle, publicLastModified, onCreate, onSelect, onOpenHistory }: AbTestListProps) {
  const entries = Object.entries(bundle.experiments).sort(([, a], [, b]) =>
    (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''),
  );

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Text variant="title-24-b" color="grey-900">
            A/B 테스트
          </Text>
          <Text variant="body-14-m" color="grey-600">
            *공개 설정(public)은 CDN으로 배포되며 캐시 TTL은 60초입니다.
          </Text>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="px-6 py-3 bg-primary-ui text-white rounded-lg hover:bg-primary-brand transition-colors text-body-16-b"
        >
          새 실험 만들기
        </button>
      </div>

      <div className="border border-grey-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-grey-100">
              <tr>
                {HEADERS.map((header) => (
                  <th key={header} className="px-6 py-4 text-left border-b border-grey-300">
                    <Text variant="body-16-b" color="grey-900" as="span">
                      {header}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(([experimentId, experiment]) => (
                <tr
                  key={experimentId}
                  onClick={() => onSelect(experimentId)}
                  className="border-b border-grey-200 hover:bg-grey-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <AbTestStatusTag status={experiment.status} isDraft={experiment.isDraft} />
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body-14-m" color="grey-900" as="span">
                      {experiment.campaignName || '(이름 없음)'}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body-14-m" color="grey-700" as="span">
                      {experimentId}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body-14-m" color="grey-700" as="span">
                      {isoToKstYmd(experiment.startAt)} ~ {isoToKstYmd(experiment.endAt)}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body-14-m" color="grey-700" as="span">
                      {experiment.variants
                        .map((variant) => `${variant.key} ${bucketsToPercent(variant.range[1] - variant.range[0])}%`)
                        .join(' / ')}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text variant="body-14-m" color="grey-700" as="span">
                      {experiment.updatedAt ? formatKstDateTime(experiment.updatedAt) : '-'}
                    </Text>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={HEADERS.length} className="px-6 py-12 text-center">
                    <Text variant="body-16-m" color="grey-500" as="span">
                      등록된 실험이 없습니다.
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between border border-grey-200 rounded-lg px-6 py-4">
        <div className="flex flex-col gap-1">
          <Text variant="body-14-m" color="grey-700">
            마지막 발행: {publicLastModified ? formatKstDateTime(publicLastModified) : '발행 이력 없음'}
          </Text>
          <Text variant="body-12-m" color="grey-600">
            public 버전 v{bundle.version} / 전체 스위치 {bundle.enabled ? 'ON' : 'OFF'}
          </Text>
        </div>
        <button type="button" onClick={onOpenHistory} className="text-body-14-m text-primary-ui hover:underline">
          발행 이력 보기
        </button>
      </div>
    </div>
  );
}
