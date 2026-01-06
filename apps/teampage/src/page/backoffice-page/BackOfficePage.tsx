'use client';
import { useState } from 'react';
import { TabButton } from '@/shared/component/TabButton';
import { PushNotificationForm } from './PushNotificationForm';
import { PushNotificationHistory } from './PushNotificationHistory';
import { PushNotificationPreview } from './PushNotificationPreview';

const TABS = ['푸시 알림', '배너 관리', '상단 공지'] as const;
const ACTIVE_TAB_INDEX = 0; // '푸시 알림'만 활성화

type TargetType = 'all' | 'marketing' | 'test';

export interface PushNotificationFormData {
  title: string;
  message: string;
  deeplink: string;
  target: TargetType;
  testEmails: string;
}

export default function BackofficePage() {
  const [selectedTab, setSelectedTab] = useState<number>(ACTIVE_TAB_INDEX);

  const handleTabClick = (index: number) => {
    // TODO: '배너 관리'와 '상단 공지'는 더미 기능이므로 클릭해도 아무 일도 일어나지 않음 추후 기능 추가
    if (index === ACTIVE_TAB_INDEX) {
      setSelectedTab(index);
    }
  };

  const handleSubmit = (data: PushNotificationFormData) => {
    // TODO: 발송 로직 구현
    alert(JSON.stringify(data));
  };

  return (
    <div className="flex flex-col gap-16 mb-8 max-md:mb-40 w-full">
      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-10 border-b border-gray-200 pb-4">
        {TABS.map((tab, idx) => (
          <TabButton
            key={idx}
            clicked={selectedTab === idx}
            onClick={() => handleTabClick(idx)}
            className={idx !== ACTIVE_TAB_INDEX ? 'cursor-not-allowed opacity-50 text-[#8E8E93]' : 'text-black'}
          >
            {tab}
          </TabButton>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="w-full">
        {selectedTab === ACTIVE_TAB_INDEX && (
          <div className="flex flex-col gap-12">
            {/* 메인 콘텐츠 영역: 왼쪽 예시 이미지 + 오른쪽 폼 */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <PushNotificationPreview />
              <PushNotificationForm onSubmit={handleSubmit} />
            </div>

            {/* 하단: 푸시 알림 내역 테이블 */}
            <PushNotificationHistory />
          </div>
        )}
      </div>
    </div>
  );
}
