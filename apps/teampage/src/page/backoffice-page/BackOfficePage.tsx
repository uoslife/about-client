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
  useSendNotificationByCsv,
  type ByTargetAllOfTarget,
  type NotificationRequest,
  type SendNotificationByCsvBody,
  getGetAllLogQueryKey,
  type NotificationLogResponse,
} from '@uoslife/api';
import { useToast } from '@/shared/component/toast';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { useAuth } from '@/entities/auth/useAuth';
import { AbTestSection } from '@/widgets/ab-test';

const TABS = ['푸시 알림', 'A/B 테스트', '배너 관리', '상단 공지'] as const;
const PUSH_TAB_INDEX = 0;
const AB_TEST_TAB_INDEX = 1;
// '배너 관리', '상단 공지'는 아직 더미 탭이라 비활성화한다.
const ENABLED_TABS = new Set<number>([PUSH_TAB_INDEX, AB_TEST_TAB_INDEX]);

type TargetType = 'TARGET' | 'EMAILS' | 'CSV_FILE';
type Target = ByTargetAllOfTarget;

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
    file?: File;
    // 서버가 실제로 파싱하기 전 클라이언트에서 보여주는 추정치일 뿐이라 확정 인원수가 아님
    csvPreviewCount?: number;
  };
}

export interface PushNotificationPreviewData {
  title: string;
  message: string;
  isMarketing: boolean;
}

export default function BackofficePage() {
  const [selectedTab, setSelectedTab] = useState<number>(PUSH_TAB_INDEX);
  const [preview, setPreview] = useState<PushNotificationPreviewData>({ title: '', message: '', isMarketing: false });
  const { toast } = useToast();
  const { open: openConfirmModal } = useConfirmModal();
  const sendNotificationMutation = useSendNotification();
  const sendNotificationByCsvMutation = useSendNotificationByCsv();
  // 발송 성공 시 로그 목록에 낙관적으로 새 행을 끼워넣는데(아래 handleSuccess 참고),
  // refetchOnWindowFocus가 켜져 있으면 탭 전환만으로 서버의 실제 로그로 캐시가 덮어써져
  // (서버 로그 반영이 지연되는 경우) 방금 끼워넣은 행이 사라져 보이는 문제가 있었다.
  const { data: notificationLogs = [] } = useGetAllLog(
    { notificationType: 'BACKOFFICE' },
    { query: { refetchOnWindowFocus: false } },
  );
  const { data: scheduledNotifications = [] } = useGetScheduledNotifications();
  const cancelScheduledNotificationMutation = useCancelScheduledNotification();
  const formRef = useRef<PushNotificationFormRef>(null);
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const handleTabClick = (index: number) => {
    // TODO: '배너 관리'와 '상단 공지'는 더미 기능이므로 클릭해도 아무 일도 일어나지 않음 추후 기능 추가
    if (ENABLED_TABS.has(index)) {
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

  const convertToCsvRequestBody = (data: PushNotificationFormData): SendNotificationByCsvBody => {
    const scheduledAt = getScheduledAtIso(data);
    return {
      notificationCsvRequest: {
        title: data.title,
        message: data.message,
        path: data.path || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
      file: data.recipient.file as File,
    };
  };

  const sendNotification = (data: PushNotificationFormData, options?: { onSuccessMessage?: string }) => {
    const queryKey = getGetAllLogQueryKey({ notificationType: 'BACKOFFICE' });

    const handleSuccess = () => {
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
            data.recipient.recipientType === 'CSV_FILE'
              ? data.recipient.file?.name || 'TARGET'
              : data.recipient.recipientType === 'EMAILS' ||
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
    };

    const handleError = () => {
      toast('발송에 실패하였습니다.');
    };

    if (data.recipient.recipientType === 'CSV_FILE') {
      sendNotificationByCsvMutation.mutate(
        { data: convertToCsvRequestBody(data) },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      sendNotificationMutation.mutate(
        { data: convertToNotificationRequest(data) },
        { onSuccess: handleSuccess, onError: handleError },
      );
    }
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
              toast('예약 내역 삭제에 실패하였습니다.');
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
    } else if (data.recipient.recipientType === 'CSV_FILE') {
      const count = data.recipient.csvPreviewCount || 0;
      openConfirmModal({
        title:
          data.delivery.type === 'SCHEDULED'
            ? `${count}명의 유저에게 ${data.delivery.scheduleHour}시 ${data.delivery.scheduleMinute}분에 발송 예약하시겠습니까?`
            : `${count}명의 유저에게 지금 발송하시겠습니까?`,
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
            className={!ENABLED_TABS.has(idx) ? 'cursor-not-allowed opacity-50 text-[#8E8E93]' : 'text-black'}
          >
            {tab}
          </TabButton>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="w-full">
        {selectedTab === AB_TEST_TAB_INDEX && <AbTestSection />}
        {selectedTab === PUSH_TAB_INDEX && (
          <div className="flex flex-col gap-12">
            {/* 메인 콘텐츠 영역: 왼쪽 예시 이미지 + 오른쪽 폼 */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <PushNotificationPreview {...preview} />
              <PushNotificationForm
                ref={formRef}
                onSubmit={handleSubmit}
                isLoading={sendNotificationMutation.isPending || sendNotificationByCsvMutation.isPending}
                onPreviewChange={setPreview}
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
