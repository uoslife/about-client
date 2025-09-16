'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CategoryKorean } from '../../const/category';
import { Divider } from '../Divider';
import { Tag } from '../Tag';
import { Text } from '../Text';
import type { CardProps } from './types';

export function CardB({ content, className, link }: CardProps) {
  const {
    title,
    summary,
    category,
    authorName,
    thumbnailUrl,
    createdAt,
    viewCount = 0,
  } = content;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link}>
      <motion.div
        whileHover={{ translateY: -5 }}
        whileTap={{ scale: 0.99 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`bg-grey-50 flex gap-10 items-start justify-start p-6 rounded-[24px] w-full cursor-pointer ${className || ''}`}
      >
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex flex-col gap-3 w-full">
            {category && (
              <Tag color="white" className="self-start">
                {CategoryKorean[category]}
              </Tag>
            )}
            <div className="flex flex-col gap-2 w-full">
              <Text
                variant="title-28-b"
                color={isHovered ? 'primary-gradiant' : 'grey-900'}
                className={`text-grey-900 w-full `}
              >
                {title}
              </Text>
              <Text variant="body-18-m" color="grey-700" className="w-full">
                {summary}
              </Text>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Text
              variant="body-16-b"
              color="grey-700"
              className="whitespace-pre"
            >
              {authorName}
            </Text>
            <Divider
              orientation="vertical"
              thickness="px"
              color="bg-grey-200"
              className="h-2.5"
            />
            <Text
              variant="body-16-m"
              color="grey-600"
              className="whitespace-pre"
            >
              {new Date(createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Divider
              orientation="vertical"
              thickness="px"
              color="bg-grey-200"
              className="h-2.5"
            />
            <Text
              variant="body-16-m"
              color="grey-600"
              className="whitespace-pre text-right"
            >
              조회수 {viewCount.toLocaleString()}
            </Text>
          </div>
        </div>
        <div className="h-36 w-60 rounded-[12px] overflow-hidden flex-shrink-0">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              width={240}
              height={144}
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </motion.div>
    </Link>
  );
}
