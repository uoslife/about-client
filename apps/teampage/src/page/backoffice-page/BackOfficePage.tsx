'use client';
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TabButton } from '@/shared/component/TabButton';
import { PushNotificationForm, type PushNotificationFormRef } from './sections/PushNotificationForm';
import { PushNotificationHistory } from './sections/PushNotificationHistory';
import { PushNotificationPreview } from './sections/PushNotificationPreview';
import {
  useSendNotification,
  type NotificationRequest,
  getGetAllLogQueryKey,
  type NotificationLogResponse,
} from '@uoslife/api';
import { useToast } from '@/shared/component/toast';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { useAuth } from '@/entities/auth/useAuth';

const TABS = ['푸시 알림', '배너 관리', '상단 공지'] as const;
const ACTIVE_TAB_INDEX = 0; // '푸시 알림'만 활성화

type TargetType = 'TARGET' | 'EMAILS';
type Target = 'ALL' | 'MARKETING_CONSENT';

export interface PushNotificationFormData {
  title: string;
  message: string;
  path: string;
  recipient: {
    recipientType: TargetType;
    emails?: string[];
    target?: Target;
  };
}

export default function BackofficePage() {
  const [selectedTab, setSelectedTab] = useState<number>(ACTIVE_TAB_INDEX);
  const { toast } = useToast();
  const { open: openConfirmModal } = useConfirmModal();
  const sendNotificationMutation = useSendNotification();
  const formRef = useRef<PushNotificationFormRef>(null);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const handleTabClick = (index: number) => {
    // TODO: '배너 관리'와 '상단 공지'는 더미 기능이므로 클릭해도 아무 일도 일어나지 않음 추후 기능 추가
    if (index === ACTIVE_TAB_INDEX) {
      setSelectedTab(index);
    }
  };

  const convertToNotificationRequest = (data: PushNotificationFormData): NotificationRequest => {
    const request: NotificationRequest = {
      title: data.title,
      message: data.message,
      path: data.path || undefined,
      recipient:
        data.recipient.recipientType === 'EMAILS'
          ? {
              recipientType: 'EMAILS',
              emails: data.recipient.emails || [],
            }
          : {
              recipientType: 'TARGET',
              target: data.recipient.target || 'ALL',
            },
    };
    return request;
  };

  const sendNotification = (data: PushNotificationFormData) => {
    const request = convertToNotificationRequest(data);
    const queryKey = getGetAllLogQueryKey({ notificationType: 'BACKOFFICE' });

    sendNotificationMutation.mutate(
      { data: request },
      {
        onSuccess: () => {
          toast('발송이 완료되었습니다.');
          if (formRef.current) {
            formRef.current.resetForm();
          }

          queryClient.setQueryData<NotificationLogResponse[]>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            const newLog: NotificationLogResponse = {
              startTime: new Date(),
              status: 'DONE',
              author: session?.user?.name || '시대생',
              target:
                data.recipient.recipientType === 'EMAILS' || data.recipient.target === 'MARKETING_CONSENT'
                  ? 'TARGET'
                  : 'ALL',
              title: data.title,
              message: data.message,
              path: data.path || undefined,
            };

            return [newLog, ...oldData].slice(0, 50);
          });
        },
        onError: () => {
          toast('발송이 실패하였습니다.');
        },
      },
    );
  };

  const handleSubmit = (data: PushNotificationFormData) => {
    if (data.recipient.recipientType === 'TARGET') {
      openConfirmModal({
        title: '실제 유저 대상으로 발송하시겠습니까?',
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => {
          sendNotification(data);
        },
      });
    } else {
      sendNotification(data);
    }
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
              <PushNotificationForm ref={formRef} onSubmit={handleSubmit} />
            </div>

            {/* 하단: 푸시 알림 내역 테이블 */}
            <PushNotificationHistory />
          </div>
        )}
      </div>
    </div>
  );
}
