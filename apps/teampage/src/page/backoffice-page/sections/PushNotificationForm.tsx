'use client';
import { useForm, Controller } from 'react-hook-form';
import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type InputHTMLAttributes,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { offset } from '@floating-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './push-notification-datepicker.css';
import { Text } from '@/shared/component/Text';
import type { PushNotificationFormData } from '../BackOfficePage';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/shared/component/toast';

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

const USER_IDS_FILE_ACCEPTED_EXTENSIONS = ['.csv'];
const USER_IDS_FILE_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/** CSV 파일 내용에서 유저 ID를 추출한다. 줄바꿈 또는 쉼표로 구분된 값을 모두 인식하고 중복은 제거한다. */
const parseUserIdsFromText = (text: string): { ids: string[]; duplicateCount: number } => {
  const raw = text
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const ids = Array.from(new Set(raw));
  return { ids, duplicateCount: raw.length - ids.length };
};

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
    const { toast } = useToast();
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

    const selectedTargetOption =
      recipientType === 'EMAILS' ? 'EMAILS' : recipientType === 'USER_IDS' ? 'USER_IDS' : target || 'ALL';

    const [emailInput, setEmailInput] = useState('');

    const [userIdsFile, setUserIdsFile] = useState<File | null>(null);
    const [userIds, setUserIds] = useState<string[]>([]);
    const [isParsingUserIdsFile, setIsParsingUserIdsFile] = useState(false);
    const [userIdsFileError, setUserIdsFileError] = useState<string | null>(null);
    const [isDraggingUserIdsFile, setIsDraggingUserIdsFile] = useState(false);

    const resetUserIdsFile = () => {
      setUserIdsFile(null);
      setUserIds([]);
      setUserIdsFileError(null);
      setIsDraggingUserIdsFile(false);
    };

    const handleUserIdsFile = (file: File) => {
      const lowerName = file.name.toLowerCase();
      const hasValidExtension = USER_IDS_FILE_ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
      if (!hasValidExtension) {
        setUserIdsFileError('CSV 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size > USER_IDS_FILE_MAX_SIZE_BYTES) {
        setUserIdsFileError('파일 용량은 5MB를 초과할 수 없습니다.');
        return;
      }

      setUserIdsFileError(null);
      setIsParsingUserIdsFile(true);

      const reader = new FileReader();
      reader.onload = () => {
        const { ids, duplicateCount } = parseUserIdsFromText(String(reader.result ?? ''));
        setIsParsingUserIdsFile(false);

        if (ids.length === 0) {
          setUserIdsFileError('파일에서 유효한 유저 정보를 찾을 수 없습니다.');
          setUserIdsFile(null);
          setUserIds([]);
          return;
        }

        setUserIdsFile(file);
        setUserIds(ids);
        clearErrors('recipient.userIds');

        if (duplicateCount > 0) {
          toast(`중복된 ${duplicateCount}개를 제외하였습니다.`);
        }
      };
      reader.onerror = () => {
        setIsParsingUserIdsFile(false);
        setUserIdsFileError('파일을 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsText(file);
    };

    const handleUserIdsFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUserIdsFile(file);
      e.target.value = '';
    };

    const handleUserIdsDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
    const handleUserIdsDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingUserIdsFile(true);
    };
    const handleUserIdsDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingUserIdsFile(false);
    };
    const handleUserIdsDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingUserIdsFile(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleUserIdsFile(file);
    };

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
        resetUserIdsFile();
      },
    }));

    useEffect(() => {
      if (recipientType !== 'EMAILS') {
        setEmailInput('');
      }
      if (recipientType !== 'USER_IDS') {
        resetUserIdsFile();
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

      if (data.recipient.recipientType === 'USER_IDS') {
        if (userIds.length === 0) {
          setError('recipient.userIds', {
            type: 'manual',
            message: '유저 정보가 담긴 파일을 업로드하세요.',
          });
          return;
        }
        data.recipient.userIds = userIds;
        data.recipient.fileName = userIdsFile?.name;
        data.recipient.file = userIdsFile ?? undefined;
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
                        checked={selectedTargetOption === 'USER_IDS'}
                        onChange={() => {
                          setValue('recipient.recipientType', 'USER_IDS');
                          setValue('recipient.target', undefined);
                          setValue('recipient.emails', undefined);
                        }}
                        className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                      />
                      <Text variant="body-16-m" color="grey-900">
                        파일로 유저 지정
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

            {/* recipientType이 USER_IDS일 때 파일 업로드 */}
            {recipientType === 'USER_IDS' && (
              <div className="mt-2 flex flex-col gap-2">
                <div
                  onDragOver={handleUserIdsDragOver}
                  onDragEnter={handleUserIdsDragEnter}
                  onDragLeave={handleUserIdsDragLeave}
                  onDrop={handleUserIdsDrop}
                  className={`w-full rounded-lg bg-grey-100 flex flex-col items-center justify-center gap-4 px-6 py-10 transition-colors ${
                    isDraggingUserIdsFile ? 'ring-2 ring-primary-ui' : ''
                  }`}
                >
                  {userIdsFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <Text variant="body-16-m" color="grey-900">
                        {userIdsFile.name}
                      </Text>
                      <Text variant="body-14-m" color="primary-ui">
                        총 {userIds.length.toLocaleString()}명의 유저가 확인되었습니다.
                      </Text>
                      <button
                        type="button"
                        onClick={resetUserIdsFile}
                        className="mt-1 px-4 py-2 text-body-14-m text-grey-600 border border-grey-300 rounded-lg hover:bg-white transition-colors"
                      >
                        파일 삭제
                      </button>
                    </div>
                  ) : (
                    <>
                      <Text variant="body-14-m" color="grey-600" className="text-center">
                        {isParsingUserIdsFile
                          ? '파일을 확인하는 중입니다...'
                          : '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 직접 선택해주세요.'}
                      </Text>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleUserIdsFileInputChange}
                          className="hidden"
                        />
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary-ui text-white rounded-lg text-body-16-m hover:bg-primary-brand transition-colors">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 15V3" />
                            <path d="M7 8l5-5 5 5" />
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          </svg>
                          파일선택
                        </span>
                      </label>
                    </>
                  )}
                </div>
                <Text variant="body-12-m" color="grey-500" as="span">
                  CSV 파일, 한 줄(또는 쉼표로 구분)에 유저 ID를 하나씩 입력해주세요.
                </Text>
                {userIdsFileError && (
                  <Text variant="body-12-m" color="grey-600" as="span">
                    {userIdsFileError}
                  </Text>
                )}
                {errors.recipient?.userIds && (
                  <Text variant="body-12-m" color="grey-600" as="span">
                    {errors.recipient.userIds.message}
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
