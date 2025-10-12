import type React from 'react';

export type TextVariant =
  | 'heading-220-b'
  | 'heading-100-b'
  | 'heading-80-b'
  | 'heading-76-b'
  | 'heading-72-b'
  | 'heading-60-b'
  | 'title-60-b'
  | 'title-48-b'
  | 'title-40-b'
  | 'title-40-m'
  | 'title-36-b'
  | 'title-28-b'
  | 'title-28-m'
  | 'title-24-b'
  | 'title-24-m'
  | 'title-20-b'
  | 'title-20-m'
  | 'title-18-b'
  | 'title-18-m'
  | 'title-16-b'
  | 'title-16-m'
  | 'body-20-b'
  | 'body-20-m'
  | 'body-18-b'
  | 'body-18-m'
  | 'body-16-b'
  | 'body-16-m'
  | 'body-14-b'
  | 'body-14-m'
  | 'body-12-b'
  | 'body-12-m';

export type ColorValue =
  | 'grey-900'
  | 'black'
  | 'white'
  | 'grey-50'
  | 'grey-100'
  | 'grey-200'
  | 'grey-300'
  | 'grey-400'
  | 'grey-500'
  | 'grey-600'
  | 'grey-700'
  | 'grey-800'
  | 'primary-ui'
  | 'primary-brand'
  | 'primary-gradiant'
  | 'primary-gradiant-minified';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant: TextVariant;
  children: React.ReactNode;
  color?: ColorValue;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const variantToClassMap: Record<TextVariant, string> = {
  'heading-220-b': 'text-[220px] leading-[1.1] font-bold',
  'heading-100-b': 'text-[100px] leading-[1.2] font-bold',
  'heading-80-b': 'text-[80px] leading-[1.2] font-bold',
  'heading-76-b': 'text-[76px] leading-[1.2] font-bold',
  'heading-72-b': 'text-[72px] leading-[1.2] font-bold',
  'heading-60-b': 'text-[60px] leading-[1.4] font-bold',
  'title-60-b': 'text-[60px] leading-[1.4] font-bold',
  'title-48-b': 'text-[48px] leading-[1.4] font-bold',
  'title-40-b': 'text-[40px] leading-[1.4] font-bold',
  'title-40-m': 'text-[40px] leading-[1.4] font-semibold',
  'title-36-b': 'text-[36px] leading-[1.4] font-bold',
  'title-28-b': 'text-[28px] leading-[1.5] font-bold',
  'title-28-m': 'text-[28px] leading-[1.5] font-medium',
  'title-24-b': 'text-[24px] leading-[1.5] font-bold',
  'title-24-m': 'text-[24px] leading-[1.5] font-medium',
  'title-20-b': 'text-[20px] leading-[1.6] font-bold',
  'title-20-m': 'text-[20px] leading-[1.6] font-medium',
  'title-18-b': 'text-[18px] leading-[1.6] font-bold',
  'title-18-m': 'text-[18px] leading-[1.6] font-medium',
  'title-16-b': 'text-[16px] leading-[1.6] font-bold',
  'title-16-m': 'text-[16px] leading-[1.6] font-medium',
  'body-20-b': 'text-[20px] leading-[1.6] font-bold',
  'body-20-m': 'text-[20px] leading-[1.6] font-medium',
  'body-18-b': 'text-[18px] leading-[1.6] font-bold',
  'body-18-m': 'text-[18px] leading-[1.6] font-medium',
  'body-16-b': 'text-[16px] leading-[1.6] font-bold',
  'body-16-m': 'text-[16px] leading-[1.6] font-medium',
  'body-14-b': 'text-[14px] leading-[1.6] font-bold',
  'body-14-m': 'text-[14px] leading-[1.6] font-medium',
  'body-12-b': 'text-[12px] leading-[1.5] font-bold',
  'body-12-m': 'text-[12px] leading-[1.5] font-medium',
};

const colorToClassMap: Record<ColorValue, string> = {
  black: 'text-black',
  white: 'text-white',
  'grey-50': 'text-grey-50',
  'grey-100': 'text-grey-100',
  'grey-200': 'text-grey-200',
  'grey-300': 'text-grey-300',
  'grey-400': 'text-grey-400',
  'grey-500': 'text-grey-500',
  'grey-600': 'text-grey-600',
  'grey-700': 'text-grey-700',
  'grey-800': 'text-grey-800',
  'grey-900': 'text-grey-900',
  'primary-ui': 'text-primary-ui',
  'primary-brand': 'text-primary-brand',
  'primary-gradiant':
    'text-transparent bg-gradient-to-r from-black via-primary-ui to-[#AACEFF] bg-clip-text',
  'primary-gradiant-minified':
    'text-transparent bg-gradient-to-r from-primary-ui to-[#AACEFF] bg-clip-text',
};

export function Text({
  variant,
  color = 'grey-900',
  children,
  className,
  as: Component = 'p',
  ...props
}: TextProps) {
  const classes = `${variantToClassMap[variant]} ${colorToClassMap[color]} ${className || ''}`;
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
