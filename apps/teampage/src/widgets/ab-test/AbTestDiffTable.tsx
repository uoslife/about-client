import { Text } from '@/shared/component/Text';
import type { ExperimentDiffLine } from '@/entities/flags';

interface AbTestDiffTableProps {
  lines: ExperimentDiffLine[];
  reassignedRatio: number | null;
}

export function AbTestDiffTable({ lines, reassignedRatio }: AbTestDiffTableProps) {
  return (
    <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto">
      {reassignedRatio !== null && (
        <div className="rounded-lg border border-danger-ui px-4 py-3">
          <Text variant="body-14-b" color="grey-900">
            실행 중인 실험의 구간이 바뀝니다.
          </Text>
          <Text variant="body-14-m" color="grey-700">
            전체 유저의 약 {(reassignedRatio * 100).toFixed(2)}%가 다른 그룹으로 재배정됩니다.
          </Text>
        </div>
      )}

      {lines.length === 0 ? (
        <Text variant="body-14-m" color="grey-600">
          변경된 내용이 없습니다.
        </Text>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-grey-100">
              <th className="px-3 py-2">
                <Text variant="body-12-b" color="grey-900" as="span">
                  항목
                </Text>
              </th>
              <th className="px-3 py-2">
                <Text variant="body-12-b" color="grey-900" as="span">
                  변경 전
                </Text>
              </th>
              <th className="px-3 py-2">
                <Text variant="body-12-b" color="grey-900" as="span">
                  변경 후
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.label} className="border-b border-grey-200 align-top">
                <td className="px-3 py-2">
                  <Text variant="body-12-m" color="grey-900" as="span">
                    {line.label}
                  </Text>
                </td>
                <td className="px-3 py-2">
                  <Text variant="body-12-m" color="grey-600" as="span">
                    {line.before || '-'}
                  </Text>
                </td>
                <td className="px-3 py-2">
                  <Text variant="body-12-m" color="primary-brand" as="span">
                    {line.after || '-'}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
