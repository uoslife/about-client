'use client';
import { useState } from 'react';
import { TabButton } from '@/shared/component/TabButton';

const TABS = ['푸시 알림', '배너 관리', '상단 공지'] as const;
const ACTIVE_TAB_INDEX = 0; // '푸시 알림'만 활성화

export default function BackofficePage() {
  const [selectedTab, setSelectedTab] = useState<number>(ACTIVE_TAB_INDEX);

  const handleTabClick = (index: number) => {
    // TODO: '배너 관리'와 '상단 공지'는 더미 기능이므로 클릭해도 아무 일도 일어나지 않음 추후 기능 추가
    if (index === ACTIVE_TAB_INDEX) {
      setSelectedTab(index);
    }
  };

  return (
    <div className="flex flex-col gap-16 mb-8 sm:mb-60 w-full">
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
          <div className="flex flex-col gap-4">
            {/* 푸시 알림 콘텐츠 영역 */}
            <p className="text-body-18-m text-gray-600">푸시 알림 관리 콘텐츠가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
