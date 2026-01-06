import { Text } from '@/shared/component/Text';
import { useGetAllLog } from '@uoslife/api';

export function PushNotificationHistory() {
  const { data: notificationLogs } = useGetAllLog({ notificationType: 'BACKOFFICE' });
  return (
    <div className="flex flex-col gap-4 whitespace-nowrap">
      <div className="flex flex-col gap-1">
        <Text variant="title-24-b" color="grey-900">
          푸시 알림 내역
        </Text>
        <Text variant="body-14-m" color="grey-600">
          *최근 50개
        </Text>
      </div>
      <div className="border border-grey-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    발송시각
                  </Text>
                </th>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    담당자
                  </Text>
                </th>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    타겟
                  </Text>
                </th>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    제목
                  </Text>
                </th>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    내용
                  </Text>
                </th>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    딥링크
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {notificationLogs && notificationLogs.length > 0 ? (
                notificationLogs.map((item) => (
                  <tr className="border-b border-grey-200 hover:bg-grey-50" key={item.startTime.toISOString()}>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.startTime.toLocaleString()}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.author}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.target}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.title}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.message}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text variant="body-14-m" color="grey-700" as="span">
                        {item.path}
                      </Text>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Text variant="body-16-m" color="grey-500" as="span">
                      발송 내역이 없습니다.
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
