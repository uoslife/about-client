'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Text } from '@/shared/component/Text';
import type { SpaceType } from '@/shared/const/category';

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>plus icon</title>
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M9.99902 1.45801C10.5743 1.45801 11.042 1.9247 11.042 2.5V8.95801H17.499C18.0743 8.95801 18.542 9.4247 18.542 10C18.5419 10.575 18.075 11.0417 17.5 11.042H11.042V17.5C11.0419 18.075 10.575 18.5417 10 18.542C9.42478 18.542 8.95814 18.0752 8.95801 17.5V11.042H2.5C1.92478 11.042 1.45716 10.5752 1.45703 10C1.45703 9.42487 1.92395 8.95827 2.49902 8.95801H8.95801V2.5C8.95801 1.92487 9.42395 1.45827 9.99902 1.45801Z"
      fill="white"
    />
  </svg>
);

type WritingButtonProps = {
  className?: string;
  from: SpaceType;
};

export function WritingButton({
  className,
  from,
  ...props
}: WritingButtonProps) {
  return (
    <Link href={{ pathname: '/write', query: { from } }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-grey-900 text-white ${className || ''}`}
        {...props}
      >
        <PlusIcon />
        <Text variant="body-20-m" color="white">
          글쓰기
        </Text>
      </motion.div>
    </Link>
  );
}
