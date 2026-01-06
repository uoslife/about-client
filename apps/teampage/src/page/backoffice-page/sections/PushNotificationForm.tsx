'use client';
import { useForm, Controller } from 'react-hook-form';
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
    formState: { errors },
  } = useForm<PushNotificationFormData>({
    defaultValues: {
      title: '',
      message: '',
      deeplink: '',
      target: 'test',
      testEmails: '',
    },
  });

  const target = watch('target');

  return (
    <div className="flex flex-col gap-6 lg:w-1/2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
            {...register('deeplink')}
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
              name="target"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="all"
                      checked={field.value === 'all'}
                      className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                    />
                    <Text variant="body-16-m" color="grey-900">
                      모든 유저
                    </Text>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="marketing"
                      checked={field.value === 'marketing'}
                      className="w-5 h-5 text-primary-ui focus:ring-primary-ui"
                    />
                    <Text variant="body-16-m" color="grey-900">
                      마케팅 수신 동의 유저 *광고 표기 필수
                    </Text>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      {...field}
                      value="test"
                      checked={field.value === 'test'}
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
          {target === 'test' && (
            <div className="mt-2">
              <textarea
                {...register('testEmails', {
                  required: target === 'test' ? '테스트 이메일을 입력하세요.' : false,
                })}
                placeholder="이메일 ID를 입력하세요. (최대 10개)"
                rows={3}
                className="w-full px-4 py-3 border border-grey-300 rounded-lg outline-none focus:border-primary-ui focus:ring-1 focus:ring-primary-ui text-body-16-m placeholder:text-grey-500 resize-none"
              />
              {errors.testEmails && (
                <Text variant="body-12-m" color="grey-600" as="span">
                  {errors.testEmails.message}
                </Text>
              )}
            </div>
          )}
        </div>

        {/* 발송하기 버튼 */}
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
