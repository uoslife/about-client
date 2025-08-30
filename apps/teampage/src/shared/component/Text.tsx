import type React from 'react';

export type TextVariant =
  | 'heading-220-b'
  | 'heading-100-b'
  | 'heading-80-b'
  | 'heading-72-b'
  | 'title-60-b'
  | 'title-48-b'
  | 'title-40-b'
  | 'title-40-m'
  | 'title-36-b'
  | 'title-28-b'
  | 'title-28-m'
  | 'title-24-b'
  | 'title-24-m'
  | 'body-20-b'
  | 'body-20-m'
  | 'body-18-b'
  | 'body-18-m'
  | 'body-16-b'
  | 'body-16-m'
  | 'body-14-sb'
  | 'body-14-m';

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
  'heading-220-b': 'text-heading-220-b font-bold',
  'heading-100-b': 'text-heading-100-b font-bold',
  'heading-80-b': 'text-heading-80-b font-bold',
  'heading-72-b': 'text-heading-72-b font-bold',
  'title-60-b': 'text-title-60-b font-bold',
  'title-48-b': 'text-title-48-b font-bold',
  'title-40-b': 'text-title-40-b font-bold',
  'title-40-m': 'text-title-40-m font-medium',
  'title-36-b': 'text-title-36-b font-bold',
  'title-28-b': 'text-title-28-b font-bold',
  'title-28-m': 'text-title-28-m font-medium',
  'title-24-b': 'text-title-24-b font-bold',
  'title-24-m': 'text-title-24-m font-medium',
  'body-20-b': 'text-body-20-b font-bold',
  'body-20-m': 'text-body-20-m font-medium',
  'body-18-b': 'text-body-18-b font-bold',
  'body-18-m': 'text-body-18-m font-medium',
  'body-16-b': 'text-body-16-b font-bold',
  'body-16-m': 'text-body-16-m font-medium',
  'body-14-sb': 'text-body-14-sb font-semibold',
  'body-14-m': 'text-body-14-m font-medium',
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
