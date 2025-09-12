'use client';

import { DOMMotionComponents, motion, MotionProps } from 'motion/react';
import React, { useState } from 'react';

type HoverScaleAnimationProps<T extends keyof DOMMotionComponents> = {
  as: T;
  children: (isHovered: boolean) => React.ReactNode;
  className?: string;
  whileHover?: MotionProps['whileHover'];
  whileTap?: MotionProps['whileTap'];
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  'children' | 'className' | 'whileHover' | 'whileTap'
>;

export function HoverScaleAnimation({
  children,
  className,
  as = 'div',
  whileHover = { y: -5 },
  whileTap = { scale: 0.99 },
  ...props
}: HoverScaleAnimationProps<typeof as>) {
  const [isHovered, setIsHovered] = useState(false);

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      whileHover={whileHover}
      whileTap={whileTap}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
      {...props}
    >
      {children(isHovered)}
    </MotionComponent>
  );
}
