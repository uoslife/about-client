import { Text } from '@/shared/component/Text';

export function PushNotificationHistory() {
  return (
    <div className="flex flex-col gap-4">
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
              {/* 예시 데이터 */}
              <tr className="border-b border-grey-200 hover:bg-grey-50">
                <td className="px-6 py-4">
                  <Text variant="body-14-m" color="grey-700" as="span">
                    25.10.30 17:00
                  </Text>
                </td>
                <td className="px-6 py-4">
                  <Text variant="body-14-m" color="grey-700" as="span">
                    김은서
                  </Text>
                </td>
                <td className="px-6 py-4">
                  <Text variant="body-14-m" color="grey-700" as="span">
                    마케팅 수신 동의 유저
                  </Text>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-grey-400 rounded"></div>
                    <Text variant="body-14-m" color="grey-700" as="span">
                      마케팅 푸시 예시입니다
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <Text variant="body-14-m" color="grey-700" as="span">
                      (광고) 내용을 입력하세요
                    </Text>
                    <Text variant="body-12-m" color="grey-500" as="span">
                      (수신거부: 더보기&gt;설정&gt;알림관리)
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Text variant="body-14-m" color="grey-700" as="span">
                    uoslife://timetable/post/1234564
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
