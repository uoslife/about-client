import Image from 'next/image';
import { Text } from '@/shared/component/Text';

export function PushNotificationPreview() {
  return (
    <div className="flex flex-col gap-6 lg:w-1/2">
      <Text variant="title-24-b" color="grey-900">
        푸시 알림 구성
      </Text>
      <div className="flex flex-col gap-4">
        <Text variant="body-18-m" color="grey-700">
          예시 이미지
        </Text>
        <Image src="/img/backoffice_example_screen.png" alt="backoffice-example" width={500} height={500} />
      </div>
    </div>
  );
}
