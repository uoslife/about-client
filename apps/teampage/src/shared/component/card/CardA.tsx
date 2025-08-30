'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { Divider } from '../Divider';
import { Tag } from '../Tag';
import { Text } from '../Text';
import type { CardProps } from './types';

export function CardA({ content, className }: CardProps) {
  const {
    id,
    authorId,
    authorName,
    title,
    category,
    summary,
    viewCount,
    thumbnailUrl,
    createdAt,
  } = content;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      whileTap={{ scale: 0.99 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex flex-col rounded-3xl max-w-[540px] cursor-pointer ${className || ''}`}
    >
      <div className="h-[324px] flex">
        <Image
          src={thumbnailUrl}
          alt={title}
          width={768}
          height={324}
          className="object-cover rounded-t-3xl"
        />
      </div>
      {category && (
        <Tag color={'blur'} className="absolute top-5 left-5 opacity-80">
          {category}
        </Tag>
      )}
      <div className="bg-grey-50 box-border flex flex-col h-[240px] p-8 items-start justify-between w-full">
        <div className="flex flex-col gap-2 w-full">
          <Text
            variant="title-28-b"
            color={isHovered ? 'primary-gradiant' : 'grey-900'}
            className="line-clamp-2 text-ellipsis text-grey-900 w-full"
          >
            {title}
          </Text>
          <Text variant="body-18-m" className="text-grey-700 w-full">
            {summary}
          </Text>
        </div>
        <div className="flex gap-3 items-center justify-start relative">
          <Text variant="body-16-b" className="text-grey-700 whitespace-pre">
            {authorName}
          </Text>
          <Divider orientation="vertical" color="bg-grey-200" className="h-3" />
          <Text variant="body-16-m" className="text-grey-600 whitespace-pre">
            {createdAt}
          </Text>
          {viewCount && (
            <Text variant="body-16-m" className="text-grey-600 whitespace-pre">
              조회수 {viewCount.toLocaleString()}
            </Text>
          )}
        </div>
      </div>
    </motion.div>
  );
}
