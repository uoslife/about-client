import { Text } from '@/shared/component/Text';
import type { NotificationLogResponse, ScheduledNotificationResponse } from '@uoslife/api';

interface PushNotificationHistoryProps {
  notificationLogs: NotificationLogResponse[];
  scheduledNotifications: ScheduledNotificationResponse[];
  onDeleteReserved: (id: number) => void;
}

export function PushNotificationHistory({
  notificationLogs,
  scheduledNotifications,
  onDeleteReserved,
}: PushNotificationHistoryProps) {
  const sentLogs = notificationLogs.filter((item) => item.status === 'DONE');

  return (
    <div className="flex flex-col gap-4 whitespace-nowrap">
      <div className="flex flex-col gap-1">
        <Text variant="title-24-b" color="grey-900">
          예약 내역
        </Text>
        <Text variant="body-14-m" color="grey-600">
          *예약된 푸시 전체
        </Text>
      </div>
      <div className="border border-grey-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    발송 예정 시각
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
                <th className="px-6 py-4 text-left border-b border-grey-300">
                  <Text variant="body-16-b" color="grey-900" as="span">
                    삭제
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduledNotifications?.length > 0 &&
                scheduledNotifications?.map((item) => {
                  const scheduledAt = item.scheduledAt instanceof Date ? item.scheduledAt : new Date(item.scheduledAt);
                  const timeKey = `${item.id}-${scheduledAt.toISOString()}`;

                  return (
                    <tr className="border-b border-grey-200 hover:bg-grey-50" key={timeKey}>
                      <td className="px-6 py-4">
                        <Text variant="body-14-m" color="primary-brand" as="span">
                          {scheduledAt.toLocaleString()}
                        </Text>
                      </td>
                      <td className="px-6 py-4">
                        <Text variant="body-14-m" color="grey-700" as="span">
                          {item.author}
                        </Text>
                      </td>
                      <td className="px-6 py-4">
                        <Text variant="body-14-m" color="grey-700" as="span">
                          {item.type}
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
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => onDeleteReserved(item.id)}
                          className="text-body-14-m text-error-main hover:underline"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {scheduledNotifications?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Text variant="body-16-m" color="grey-500" as="span">
                      예약 내역이 없습니다.
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <Text variant="title-24-b" color="grey-900">
          발송 내역
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
              {sentLogs.length > 0 &&
                sentLogs.map((item) => {
                  const startTime = item.startTime instanceof Date ? item.startTime : new Date(item.startTime);
                  const timeKey = startTime instanceof Date ? startTime.toISOString() : String(item.startTime);

                  return (
                    <tr className="border-b border-grey-200 hover:bg-grey-50" key={timeKey}>
                      <td className="px-6 py-4">
                        <Text variant="body-14-m" color="grey-700" as="span">
                          {startTime.toLocaleString()}
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
                  );
                })}
              {sentLogs.length === 0 && (
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
