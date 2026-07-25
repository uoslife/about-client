import { Text } from '@/shared/component/Text';

/**
 * 배너 관리 탭 자리표시자. 탭 활성화만 우선 처리하고, 실제 배너 CRUD 기능은
 * 이후 구현한다 (기존 푸시 알림 탭의 레이아웃 컨벤션을 따를 예정).
 */
export function BannerManagementPlaceholder() {
  return (
    <div className="flex flex-col gap-6">
      <Text variant="title-24-b" color="grey-900">
        배너 관리
      </Text>
      <div className="flex items-center justify-center border border-grey-300 rounded-lg py-24">
        <Text variant="body-16-m" color="grey-500">
          배너 관리 기능은 준비 중입니다.
        </Text>
      </div>
    </div>
  );
}
