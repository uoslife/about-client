'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import { offset } from '@floating-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './push-notification-datepicker.css';
import { Text } from '@/shared/component/Text';
import type { PushNotificationFormData } from '../BackOfficePage';
import Image from 'next/image';
import Link from 'next/link';

interface PushNotificationFormProps {
  onSubmit: (data: PushNotificationFormData) => void;
  isLoading: boolean;
}

export interface PushNotificationFormRef {
  resetForm: () => void;
}

const LINK = {
  deeplink:
    'https://www.notion.so/uoslife/2d5de257e4b180b3bfcad16644189917?v=2d5de257e4b18099863b000cc736d3eb&source=copy_link',
  emails:
    'https://www.notion.so/uoslife/2d5de257e4b180eb9589e34ccd21cc66?v=2d5de257e4b181b6bd6b000c97e2f813&source=copy_link',
};

const HOURS = Array.from({ length: 24 }, (_, idx) => String(idx).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, idx) => String(idx * 5).padStart(2, '0'));

/** 로컬 날짜만 YYYY-MM-DD로 (타임존 이슈 완화용 정오 기준) */
const formatYmd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseYmdToLocalNoon = (ymd: string) => new Date(`${ymd}T12:00:00`);

type ScheduleDateInputProps = InputHTMLAttributes<HTMLInputElement>;

const ScheduleDateCustomInput = forwardRef<HTMLInputElement, ScheduleDateInputProps>(function ScheduleDateCustomInput(
  { className, onKeyDown, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        className={`w-full pl-4 pr-12 py-3 border border-grey-300 rounded-lg bg-white outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m text-grey-900 placeholder:text-grey-500 ${className ?? ''}`}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (e.key.length === 1) e.preventDefault();
        }}
        {...props}
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
        aria-hidden
      >
        <Image src="/svg/calendar.svg" alt="" width={24} height={24} />
      </span>
    </div>
  );
});
ScheduleDateCustomInput.displayName = 'ScheduleDateCustomInput';

export const PushNotificationForm = forwardRef<PushNotificationFormRef, PushNotificationFormProps>(
  ({ onSubmit, isLoading }, ref) => {
    const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      setError,
      clearErrors,
      reset,
      formState: { errors },
    } = useForm<PushNotificationFormData>({
      defaultValues: {
        title: '',
        message: '',
        path: '',
        delivery: {
          type: 'IMMEDIATE',
          scheduleDate: '',
          scheduleHour: '00',
          scheduleMinute: '00',
        },
        recipient: {
          recipientType: 'TARGET',
          emails: [],
          target: 'ALL',
        },
      },
    });

    const recipientType = watch('recipient.recipientType');
    const target = watch('recipient.target');
    const deliveryType = watch('delivery.type');

    const selectedTargetOption = recipientType === 'EMAILS' ? 'EMAILS' : target || 'ALL';

    const [emailInput, setEmailInput] = useState('');

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        reset({
          title: '',
          message: '',
          path: '',
          delivery: {
            type: 'IMMEDIATE',
            scheduleDate: '',
            scheduleHour: '00',
            scheduleMinute: '00',
          },
          recipient: {
            recipientType: 'TARGET',
            emails: [],
            target: 'ALL',
          },
        });
        setEmailInput('');
      },
    }));

    useEffect(() => {
      if (recipientType !== 'EMAILS') {
        setEmailInput('');
      }
    }, [recipientType]);

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

      if (data.delivery.type === 'SCHEDULED' && !data.delivery.scheduleDate) {
        setError('delivery.scheduleDate', {
          type: 'manual',
          message: '예약 날짜를 선택하세요.',
        });
        return;
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
                        checked={selectedTargetOption === 'CAFETERIA_CONSENT'}
                        onChange={() => {
                          setValue('recipient.recipientType', 'TARGET');
                          setValue('recipient.target', 'CAFETERIA_CONSENT');
                          setValue('recipient.emails', undefined);
                        }}
                        className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                      />
                      <Text variant="body-16-m" color="grey-900">
                        학식 수신동의 유저
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

          <div className="flex flex-col gap-4">
            <Text variant="body-18-m" color="grey-900">
              발송 시간 설정
            </Text>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={deliveryType === 'IMMEDIATE'}
                onChange={() => {
                  setValue('delivery.type', 'IMMEDIATE');
                  clearErrors('delivery.scheduleDate');
                }}
                className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
              />
              <Text variant="body-16-m" color="grey-900">
                즉시 발송
              </Text>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={deliveryType === 'SCHEDULED'}
                onChange={() => setValue('delivery.type', 'SCHEDULED')}
                className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
              />
              <Text variant="body-16-m" color="grey-900">
                예약 발송
              </Text>
            </label>

            {deliveryType === 'SCHEDULED' && (
              <div className="border border-grey-300 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Text variant="body-14-m" color="grey-700">
                      날짜
                    </Text>
                    <Controller
                      name="delivery.scheduleDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? parseYmdToLocalNoon(field.value) : null}
                          onChange={(date) => {
                            field.onChange(date ? formatYmd(date) : '');
                            clearErrors('delivery.scheduleDate');
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          dateFormat="yyyy.MM.dd"
                          placeholderText="년/월/일"
                          customInput={<ScheduleDateCustomInput />}
                          calendarClassName="push-notification-datepicker-calendar"
                          showPopperArrow={false}
                          wrapperClassName="w-full"
                          popperPlacement="bottom-start"
                          popperModifiers={[offset(12)]}
                          popperClassName="z-[100]"
                        />
                      )}
                    />
                    {errors.delivery?.scheduleDate && (
                      <Text variant="body-12-m" color="grey-600" as="span">
                        {errors.delivery.scheduleDate.message}
                      </Text>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Text variant="body-14-m" color="grey-700">
                      시간
                    </Text>
                    <div className="flex items-center gap-2">
                      <select
                        {...register('delivery.scheduleHour')}
                        className="px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m"
                      >
                        {HOURS.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <Text variant="body-16-m" color="grey-700">
                        :
                      </Text>
                      <select
                        {...register('delivery.scheduleMinute')}
                        className="px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m"
                      >
                        {MINUTES.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-primary-ui text-white rounded-lg hover:bg-primary-brand transition-colors text-body-18-b disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '발송 중' : '발송하기'}
            </button>
          </div>
        </form>
      </div>
    );
  },
);

PushNotificationForm.displayName = 'PushNotificationForm';
