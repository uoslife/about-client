import type React from 'react';
import { type ColorValue, Text } from './Text';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color: 'white' | 'black' | 'blur';
}

export function Tag({ children, color, className, ...props }: TagProps) {
  const currentColor = colorClass[color] ?? colorClass.white;

  return (
    <div
      className={`flex items-center h-10 justify-center px-4 py-0 rounded-[20px] ${currentColor?.background} ${currentColor?.text} ${className || ''}`}
      {...props}
    >
      <Text variant="body-18-m" color={colorClass[color].text}>
        {children}
      </Text>
    </div>
  );
}

type TagColorProps = {
  background: string;
  text: ColorValue;
};

const colorClass: Record<'white' | 'black' | 'blur', TagColorProps> = {
  white: {
    background: 'bg-grey-100',
    text: 'grey-600',
  },
  black: {
    background: 'bg-grey-800',
    text: 'grey-100',
  },
  blur: {
    background: 'backdrop-blur-[15px] backdrop-filter bg-[rgba(0,0,0,0.4)]',
    text: 'white',
  },
} as const;
