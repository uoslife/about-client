'use client';
import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TabButton } from '@/shared/component/TabButton';
import { PushNotificationForm, type PushNotificationFormRef } from './sections/PushNotificationForm';
import { PushNotificationHistory } from './sections/PushNotificationHistory';
import { PushNotificationPreview } from './sections/PushNotificationPreview';
import {
  getGetScheduledNotificationsQueryKey,
  useCancelScheduledNotification,
  useGetAllLog,
  useGetScheduledNotifications,
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
type Target = 'ALL' | 'MARKETING_CONSENT' | 'CAFETERIA_CONSENT';

export interface PushNotificationFormData {
  title: string;
  message: string;
  path: string;
  delivery: {
    type: 'IMMEDIATE' | 'SCHEDULED';
    scheduleDate: string;
    scheduleHour: string;
    scheduleMinute: string;
  };
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
  const { data: notificationLogs = [] } = useGetAllLog({ notificationType: 'BACKOFFICE' });
  const { data: scheduledNotifications = [] } = useGetScheduledNotifications();
  const cancelScheduledNotificationMutation = useCancelScheduledNotification();
  const formRef = useRef<PushNotificationFormRef>(null);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const handleTabClick = (index: number) => {
    // TODO: '배너 관리'와 '상단 공지'는 더미 기능이므로 클릭해도 아무 일도 일어나지 않음 추후 기능 추가
    if (index === ACTIVE_TAB_INDEX) {
      setSelectedTab(index);
    }
  };

  const getScheduledAtIso = (data: PushNotificationFormData) => {
    if (data.delivery.type !== 'SCHEDULED') return undefined;
    const { scheduleDate, scheduleHour, scheduleMinute } = data.delivery;
    return new Date(`${scheduleDate}T${scheduleHour}:${scheduleMinute}:00`).toISOString();
  };

  const convertToNotificationRequest = (data: PushNotificationFormData): NotificationRequest => {
    const scheduledAt = getScheduledAtIso(data);
    const request: NotificationRequest = {
      title: data.title,
      message: data.message,
      path: data.path || undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
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

  const sendNotification = (data: PushNotificationFormData, options?: { onSuccessMessage?: string }) => {
    const request = convertToNotificationRequest(data);
    const queryKey = getGetAllLogQueryKey({ notificationType: 'BACKOFFICE' });

    sendNotificationMutation.mutate(
      { data: request },
      {
        onSuccess: () => {
          toast(
            options?.onSuccessMessage ||
              (data.delivery.type === 'SCHEDULED' ? '예약 발송이 등록되었습니다.' : '발송이 완료되었습니다.'),
          );
          if (formRef.current) {
            formRef.current.resetForm();
          }

          queryClient.invalidateQueries({ queryKey: getGetScheduledNotificationsQueryKey() });
          queryClient.setQueryData<NotificationLogResponse[]>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            const newLog: NotificationLogResponse = {
              startTime: getScheduledAtIso(data) ? new Date(getScheduledAtIso(data)!) : new Date(),
              status: data.delivery.type === 'SCHEDULED' ? 'RESERVED' : 'DONE',
              author: session?.user?.name || '시대생',
              target:
                data.recipient.recipientType === 'EMAILS' ||
                data.recipient.target === 'MARKETING_CONSENT' ||
                data.recipient.target === 'CAFETERIA_CONSENT'
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

  const handleDeleteReserved = (id: number) => {
    openConfirmModal({
      title: '예약 발송을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
      onConfirm: () => {
        cancelScheduledNotificationMutation.mutate(
          { id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetScheduledNotificationsQueryKey() });
              toast('예약 내역이 삭제되었습니다.');
            },
            onError: () => {
              toast('예약 내역 삭제에 실패했습니다.');
            },
          },
        );
      },
    });
  };

  const handleSubmit = (data: PushNotificationFormData) => {
    if (data.delivery.type === 'SCHEDULED') {
      const scheduledAt = new Date(getScheduledAtIso(data)!);
      const now = new Date();
      if (scheduledAt <= now) {
        toast('현재 시간보다 이른 시간으로 예약할 수 없습니다. 발송에 실패했습니다.');
        return;
      }
    }

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
              <PushNotificationForm
                ref={formRef}
                onSubmit={handleSubmit}
                isLoading={sendNotificationMutation.isPending}
              />
            </div>

            {/* 하단: 푸시 알림 내역 테이블 */}
            <PushNotificationHistory
              notificationLogs={notificationLogs}
              scheduledNotifications={scheduledNotifications}
              onDeleteReserved={handleDeleteReserved}
            />
          </div>
        )}
      </div>
    </div>
  );
}
