'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CategoryKorean } from '@/shared/const/category';
import { HoverScaleAnimation } from '../animation/HoverScaleAnimation';
import { Divider } from '../Divider';
import { Tag } from '../Tag';
import { Text } from '../Text';
import type { CardProps } from './types';

export function CardA({
  content,
  className,
  link,
  showViewCount = true,
}: CardProps) {
  const {
    authorName,
    title,
    category,
    summary,
    viewCount,
    thumbnailUrl,
    createdAt,
  } = content;

  return (
    <Link href={link} className='w-full'>
      <HoverScaleAnimation
        className={`relative flex flex-col rounded-3xl max-w-screen-lg w-full cursor-pointer ${className || ''}`}
      >
        {(isHovered) => (
          <>
            <div className="h-[324px] w-full flex max-md:h-fit">
              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  width={768}
                  height={324}
                  className="object-cover rounded-t-3xl max-md:w-full max-md:h-[197px]"
                />
              )}
            </div>
            {category && (
              <Tag color={'blur'} className="absolute top-5 left-5 opacity-80">
                {CategoryKorean[category]}
              </Tag>
            )}
            <div className="bg-grey-50 box-border flex flex-col rounded-b-3xl h-[240px] p-8 items-start justify-between w-full max-md:w-full max-md:gap-3 max-md:h-fit">
              <div className="flex flex-col gap-2 w-full">
                <Text
                  variant="title-28-b"
                  color={isHovered ? 'primary-gradiant' : 'grey-900'}
                  className="line-clamp-2 overflow-ellipsis text-grey-900 w-full max-md:text-title-16-b"
                >
                  {title}
                </Text>
                <Text
                  variant="body-18-m"
                  color="grey-700"
                  className="line-clamp-2 overflow-ellipsis w-full max-md:text-body-14-m"
                >
                  {summary}
                </Text>
              </div>
              <div className="flex gap-3 items-center justify-start relative">
                <Text
                  variant="body-16-b"
                  color="grey-700"
                  className="whitespace-pre max-md:text-body-12-b"
                >
                  {authorName}
                </Text>
                <Divider
                  orientation="vertical"
                  color="bg-grey-200"
                  className="h-3 w-px"
                />
                <Text
                  variant="body-16-m"
                  color="grey-600"
                  className="whitespace-pre max-md:text-body-12-m"
                >
                  {new Date(createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                {showViewCount && viewCount && (
                  <Text
                    variant="body-16-m"
                    color="grey-600"
                    className="whitespace-pre max-md:text-body-12-m"
                  >
                    조회수 {viewCount.toLocaleString()}
                  </Text>
                )}
              </div>
            </div>
          </>
        )}
      </HoverScaleAnimation>
    </Link>
  );
}
