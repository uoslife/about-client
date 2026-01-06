'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Text } from '@/shared/component/Text';
import type { PushNotificationFormData } from '../BackOfficePage';
import Image from 'next/image';
import Link from 'next/link';

interface PushNotificationFormProps {
  onSubmit: (data: PushNotificationFormData) => void;
}

const LINK = {
  deeplink:
    'https://www.notion.so/uoslife/2d5de257e4b180b3bfcad16644189917?v=2d5de257e4b18099863b000cc736d3eb&source=copy_link',
  emails:
    'https://www.notion.so/uoslife/2d5de257e4b180eb9589e34ccd21cc66?v=2d5de257e4b181b6bd6b000c97e2f813&source=copy_link',
};

export function PushNotificationForm({ onSubmit }: PushNotificationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PushNotificationFormData>({
    defaultValues: {
      title: '',
      message: '',
      path: '',
      recipient: {
        recipientType: 'TARGET',
        emails: [],
        target: 'ALL',
      },
    },
  });

  const recipientType = watch('recipient.recipientType');
  const target = watch('recipient.target');

  // 현재 선택된 타겟 옵션 계산 (UI용)
  const selectedTargetOption = recipientType === 'EMAILS' ? 'EMAILS' : target || 'ALL';

  // 이메일 입력을 위한 로컬 상태 (쉼표 입력 보존을 위해)
  const [emailInput, setEmailInput] = useState('');

  // recipientType이 EMAILS로 변경될 때 초기화
  useEffect(() => {
    if (recipientType !== 'EMAILS') {
      setEmailInput('');
    }
  }, [recipientType]);

  // submit 전에 이메일 문자열을 배열로 변환하고 validation
  const handleFormSubmit = (data: PushNotificationFormData) => {
    if (data.recipient.recipientType === 'EMAILS') {
      if (!emailInput || emailInput.trim().length === 0) {
        setError('recipient.emails', {
          type: 'manual',
          message: '테스트 이메일을 입력하세요.',
        });
        return;
      }
      const emailArray = emailInput
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      if (emailArray.length === 0) {
        setError('recipient.emails', {
          type: 'manual',
          message: '테스트 이메일을 입력하세요.',
        });
        return;
      }

      if (emailArray.length > 10) {
        setError('recipient.emails', {
          type: 'manual',
          message: '최대 10개까지 입력 가능합니다.',
        });
        return;
      }

      data.recipient.emails = emailArray;
    }
    onSubmit(data);
  };

  return (
    <div className="flex flex-col gap-6 lg:w-1/2">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <Text variant="body-18-m" color="grey-900">
            제목
          </Text>
          <input
            type="text"
            {...register('title', { required: '제목을 입력하세요.' })}
            placeholder="알림 제목을 입력하세요."
            className="w-full px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m placeholder:text-grey-500"
          />
          {errors.title && (
            <Text variant="body-12-m" color="grey-600" as="span">
              {errors.title.message}
            </Text>
          )}
        </div>

        {/* 메시지 */}
        <div className="flex flex-col gap-2">
          <Text variant="body-18-m" color="grey-900">
            메시지
          </Text>
          <textarea
            {...register('message', { required: '메시지를 입력하세요.' })}
            placeholder="알림 내용을 입력하세요."
            rows={6}
            className="w-full px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m placeholder:text-grey-500 resize-none"
          />
          {errors.message && (
            <Text variant="body-12-m" color="grey-600" as="span">
              {errors.message.message}
            </Text>
          )}
        </div>

        {/* 딥링크 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Text variant="body-18-m" color="grey-900">
              딥링크
            </Text>
            <Link href={LINK.deeplink} target="_blank" className="w-4 h-4 flex items-center justify-center">
              <Image src="/svg/link.svg" alt="link" width={16} height={16} />
            </Link>
          </div>
          <input
            type="text"
            {...register('path')}
            placeholder="딥링크를 입력하세요."
            className="w-full px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m placeholder:text-grey-500"
          />
        </div>

        {/* 타겟 */}
        <div className="flex flex-col gap-4">
          <Text variant="body-18-m" color="grey-900">
            타겟
          </Text>
          <div className="flex flex-col gap-3">
            <Controller
              name="recipient"
              control={control}
              rules={{
                validate: (value) => {
                  if (value.recipientType === 'TARGET' && !value.target) {
                    return '타겟을 선택하세요.';
                  }
                  return true;
                },
              }}
              render={() => (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedTargetOption === 'ALL'}
                      onChange={() => {
                        setValue('recipient.recipientType', 'TARGET');
                        setValue('recipient.target', 'ALL');
                        setValue('recipient.emails', undefined);
                      }}
                      className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                    />
                    <Text variant="body-16-m" color="grey-900">
                      모든 유저
                    </Text>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedTargetOption === 'MARKETING_CONSENT'}
                      onChange={() => {
                        setValue('recipient.recipientType', 'TARGET');
                        setValue('recipient.target', 'MARKETING_CONSENT');
                        setValue('recipient.emails', undefined);
                      }}
                      className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                    />
                    <Text variant="body-16-m" color="grey-900">
                      마케팅 수신 동의 유저 *광고 표기 필수
                    </Text>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedTargetOption === 'EMAILS'}
                      onChange={() => {
                        setValue('recipient.recipientType', 'EMAILS');
                        setValue('recipient.target', undefined);
                        setValue('recipient.emails', []);
                      }}
                      className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                    />
                    <div className="flex items-center gap-2">
                      <Text variant="body-16-m" color="grey-900">
                        테스트 (직접 입력)
                      </Text>
                      <Link href={LINK.emails} target="_blank" className="w-4 h-4 flex items-center justify-center">
                        <Image src="/svg/link.svg" alt="link" width={16} height={16} />
                      </Link>
                    </div>
                  </label>
                </>
              )}
            />
          </div>

          {/* recipientType이 EMAILS일 때 emails 입력 */}
          {recipientType === 'EMAILS' && (
            <div className="mt-2">
              <textarea
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errors.recipient?.emails) {
                    clearErrors('recipient.emails');
                  }
                }}
                placeholder="이메일 ID를 입력하세요. (최대 10개, 쉼표로 구분)"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m placeholder:text-grey-500 resize-none"
              />
              {errors.recipient?.emails && (
                <Text variant="body-12-m" color="grey-600" as="span">
                  {errors.recipient.emails.message}
                </Text>
              )}
            </div>
          )}
          {(errors.recipient as any)?.message && (
            <Text variant="body-12-m" color="grey-600" as="span">
              {(errors.recipient as any).message}
            </Text>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-primary-ui text-white rounded-lg hover:bg-primary-brand transition-colors text-body-18-b"
          >
            발송하기
          </button>
        </div>
      </form>
    </div>
  );
}
