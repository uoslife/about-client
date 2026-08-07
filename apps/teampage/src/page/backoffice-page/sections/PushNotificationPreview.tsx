import Image from 'next/image';
import { Text } from '@/shared/component/Text';
import type { PushNotificationPreviewData } from '../BackOfficePage';

export function PushNotificationPreview({ title, message, isMarketing }: PushNotificationPreviewData) {
  const displayTitle = title || '제목을 입력하세요';
  const displayMessage = message || '내용을 입력하세요';

  return (
    <div className="flex flex-col gap-6 lg:w-1/2">
      <Text variant="title-24-b" color="grey-900">
        푸시 알림 구성
      </Text>
      <div className="flex flex-col gap-4">
        <Text variant="body-18-m" color="grey-700">
          실시간 미리보기
        </Text>
        <div className="bg-grey-50 rounded-2xl px-5 py-12">
          <div className="flex items-center gap-3 bg-grey-200 rounded-xl p-4">
            <Image
              src="/img/uoslife_logo_white.png"
              alt=""
              width={44}
              height={44}
              className="shrink-0 shadow-sm rounded-[8px]"
            />
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <Text variant="body-14-b" color={title ? 'grey-900' : 'grey-500'} as="span">
                  {displayTitle}
                </Text>
                <Text variant="body-12-m" color="grey-600" as="span">
                  지금
                </Text>
              </div>
              <Text variant="body-14-m" color={message ? 'grey-700' : 'grey-500'} as="span">
                {isMarketing && message ? `(광고) ${displayMessage}` : displayMessage}
              </Text>
              {isMarketing && (
                <Text variant="body-12-m" color="grey-600" as="span">
                  (수신거부: 더보기&gt;설정&gt;알림관리)
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="body-18-m" color="grey-700">
          예시 이미지
        </Text>
        <Image src="/img/backoffice_example_screen.png" alt="backoffice-example" width={500} height={500} />
      </div>
    </div>
  );
}
