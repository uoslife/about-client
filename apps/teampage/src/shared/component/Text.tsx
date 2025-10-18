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
  variant: TextVariant | { [key: string]: TextVariant };
  children: React.ReactNode;
  color?: ColorValue;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
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

type ResponsiveVariants = {
  initial?: TextVariant;
  sm?: TextVariant;
  md?: TextVariant;
  lg?: TextVariant;
  xl?: TextVariant;
};

// 모든 반응형 조합을 미리 정의
const responsiveVariantMap = {
  'heading-220-b': {
    base: 'text-[220px] leading-[1.1] font-bold',
    sm: 'sm:text-[220px] sm:leading-[1.1] sm:font-bold',
    md: 'md:text-[220px] md:leading-[1.1] md:font-bold',
    lg: 'lg:text-[220px] lg:leading-[1.1] lg:font-bold',
    xl: 'xl:text-[220px] xl:leading-[1.1] xl:font-bold',
  },
  'heading-100-b': {
    base: 'text-[100px] leading-[1.2] font-bold',
    sm: 'sm:text-[100px] sm:leading-[1.2] sm:font-bold',
    md: 'md:text-[100px] md:leading-[1.2] md:font-bold',
    lg: 'lg:text-[100px] lg:leading-[1.2] lg:font-bold',
    xl: 'xl:text-[100px] xl:leading-[1.2] xl:font-bold',
  },
  'heading-80-b': {
    base: 'text-[80px] leading-[1.2] font-bold',
    sm: 'sm:text-[80px] sm:leading-[1.2] sm:font-bold',
    md: 'md:text-[80px] md:leading-[1.2] md:font-bold',
    lg: 'lg:text-[80px] lg:leading-[1.2] lg:font-bold',
    xl: 'xl:text-[80px] xl:leading-[1.2] xl:font-bold',
  },
  'heading-76-b': {
    base: 'text-[76px] leading-[1.2] font-bold',
    sm: 'sm:text-[76px] sm:leading-[1.2] sm:font-bold',
    md: 'md:text-[76px] md:leading-[1.2] md:font-bold',
    lg: 'lg:text-[76px] lg:leading-[1.2] lg:font-bold',
    xl: 'xl:text-[76px] xl:leading-[1.2] xl:font-bold',
  },
  'heading-72-b': {
    base: 'text-[72px] leading-[1.2] font-bold',
    sm: 'sm:text-[72px] sm:leading-[1.2] sm:font-bold',
    md: 'md:text-[72px] md:leading-[1.2] md:font-bold',
    lg: 'lg:text-[72px] lg:leading-[1.2] lg:font-bold',
    xl: 'xl:text-[72px] xl:leading-[1.2] xl:font-bold',
  },
  'heading-60-b': {
    base: 'text-[60px] leading-[1.4] font-bold',
    sm: 'sm:text-[60px] sm:leading-[1.4] sm:font-bold',
    md: 'md:text-[60px] md:leading-[1.4] md:font-bold',
    lg: 'lg:text-[60px] lg:leading-[1.4] lg:font-bold',
    xl: 'xl:text-[60px] xl:leading-[1.4] xl:font-bold',
  },
  'title-60-b': {
    base: 'text-[60px] leading-[1.4] font-bold',
    sm: 'sm:text-[60px] sm:leading-[1.4] sm:font-bold',
    md: 'md:text-[60px] md:leading-[1.4] md:font-bold',
    lg: 'lg:text-[60px] lg:leading-[1.4] lg:font-bold',
    xl: 'xl:text-[60px] xl:leading-[1.4] xl:font-bold',
  },
  'title-48-b': {
    base: 'text-[48px] leading-[1.4] font-bold',
    sm: 'sm:text-[48px] sm:leading-[1.4] sm:font-bold',
    md: 'md:text-[48px] md:leading-[1.4] md:font-bold',
    lg: 'lg:text-[48px] lg:leading-[1.4] lg:font-bold',
    xl: 'xl:text-[48px] xl:leading-[1.4] xl:font-bold',
  },
  'title-40-b': {
    base: 'text-[40px] leading-[1.4] font-bold',
    sm: 'sm:text-[40px] sm:leading-[1.4] sm:font-bold',
    md: 'md:text-[40px] md:leading-[1.4] md:font-bold',
    lg: 'lg:text-[40px] lg:leading-[1.4] lg:font-bold',
    xl: 'xl:text-[40px] xl:leading-[1.4] xl:font-bold',
  },
  'title-40-m': {
    base: 'text-[40px] leading-[1.4] font-semibold',
    sm: 'sm:text-[40px] sm:leading-[1.4] sm:font-semibold',
    md: 'md:text-[40px] md:leading-[1.4] md:font-semibold',
    lg: 'lg:text-[40px] lg:leading-[1.4] lg:font-semibold',
    xl: 'xl:text-[40px] xl:leading-[1.4] xl:font-semibold',
  },
  'title-36-b': {
    base: 'text-[36px] leading-[1.4] font-bold',
    sm: 'sm:text-[36px] sm:leading-[1.4] sm:font-bold',
    md: 'md:text-[36px] md:leading-[1.4] md:font-bold',
    lg: 'lg:text-[36px] lg:leading-[1.4] lg:font-bold',
    xl: 'xl:text-[36px] xl:leading-[1.4] xl:font-bold',
  },
  'title-28-b': {
    base: 'text-[28px] leading-[1.5] font-bold',
    sm: 'sm:text-[28px] sm:leading-[1.5] sm:font-bold',
    md: 'md:text-[28px] md:leading-[1.5] md:font-bold',
    lg: 'lg:text-[28px] lg:leading-[1.5] lg:font-bold',
    xl: 'xl:text-[28px] xl:leading-[1.5] xl:font-bold',
  },
  'title-28-m': {
    base: 'text-[28px] leading-[1.5] font-medium',
    sm: 'sm:text-[28px] sm:leading-[1.5] sm:font-medium',
    md: 'md:text-[28px] md:leading-[1.5] md:font-medium',
    lg: 'lg:text-[28px] lg:leading-[1.5] lg:font-medium',
    xl: 'xl:text-[28px] xl:leading-[1.5] xl:font-medium',
  },
  'title-24-b': {
    base: 'text-[24px] leading-[1.5] font-bold',
    sm: 'sm:text-[24px] sm:leading-[1.5] sm:font-bold',
    md: 'md:text-[24px] md:leading-[1.5] md:font-bold',
    lg: 'lg:text-[24px] lg:leading-[1.5] lg:font-bold',
    xl: 'xl:text-[24px] xl:leading-[1.5] xl:font-bold',
  },
  'title-24-m': {
    base: 'text-[24px] leading-[1.5] font-medium',
    sm: 'sm:text-[24px] sm:leading-[1.5] sm:font-medium',
    md: 'md:text-[24px] md:leading-[1.5] md:font-medium',
    lg: 'lg:text-[24px] lg:leading-[1.5] lg:font-medium',
    xl: 'xl:text-[24px] xl:leading-[1.5] xl:font-medium',
  },
  'title-20-b': {
    base: 'text-[20px] leading-[1.6] font-bold',
    sm: 'sm:text-[20px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[20px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[20px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[20px] xl:leading-[1.6] xl:font-bold',
  },
  'title-20-m': {
    base: 'text-[20px] leading-[1.6] font-medium',
    sm: 'sm:text-[20px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[20px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[20px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[20px] xl:leading-[1.6] xl:font-medium',
  },
  'title-18-b': {
    base: 'text-[18px] leading-[1.6] font-bold',
    sm: 'sm:text-[18px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[18px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[18px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[18px] xl:leading-[1.6] xl:font-bold',
  },
  'title-18-m': {
    base: 'text-[18px] leading-[1.6] font-medium',
    sm: 'sm:text-[18px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[18px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[18px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[18px] xl:leading-[1.6] xl:font-medium',
  },
  'title-16-b': {
    base: 'text-[16px] leading-[1.6] font-bold',
    sm: 'sm:text-[16px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[16px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[16px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[16px] xl:leading-[1.6] xl:font-bold',
  },
  'title-16-m': {
    base: 'text-[16px] leading-[1.6] font-medium',
    sm: 'sm:text-[16px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[16px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[16px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[16px] xl:leading-[1.6] xl:font-medium',
  },
  'body-20-b': {
    base: 'text-[20px] leading-[1.6] font-bold',
    sm: 'sm:text-[20px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[20px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[20px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[20px] xl:leading-[1.6] xl:font-bold',
  },
  'body-20-m': {
    base: 'text-[20px] leading-[1.6] font-medium',
    sm: 'sm:text-[20px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[20px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[20px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[20px] xl:leading-[1.6] xl:font-medium',
  },
  'body-18-b': {
    base: 'text-[18px] leading-[1.6] font-bold',
    sm: 'sm:text-[18px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[18px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[18px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[18px] xl:leading-[1.6] xl:font-bold',
  },
  'body-18-m': {
    base: 'text-[18px] leading-[1.6] font-medium',
    sm: 'sm:text-[18px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[18px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[18px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[18px] xl:leading-[1.6] xl:font-medium',
  },
  'body-16-b': {
    base: 'text-[16px] leading-[1.6] font-bold',
    sm: 'sm:text-[16px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[16px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[16px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[16px] xl:leading-[1.6] xl:font-bold',
  },
  'body-16-m': {
    base: 'text-[16px] leading-[1.6] font-medium',
    sm: 'sm:text-[16px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[16px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[16px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[16px] xl:leading-[1.6] xl:font-medium',
  },
  'body-14-b': {
    base: 'text-[14px] leading-[1.6] font-bold',
    sm: 'sm:text-[14px] sm:leading-[1.6] sm:font-bold',
    md: 'md:text-[14px] md:leading-[1.6] md:font-bold',
    lg: 'lg:text-[14px] lg:leading-[1.6] lg:font-bold',
    xl: 'xl:text-[14px] xl:leading-[1.6] xl:font-bold',
  },
  'body-14-m': {
    base: 'text-[14px] leading-[1.6] font-medium',
    sm: 'sm:text-[14px] sm:leading-[1.6] sm:font-medium',
    md: 'md:text-[14px] md:leading-[1.6] md:font-medium',
    lg: 'lg:text-[14px] lg:leading-[1.6] lg:font-medium',
    xl: 'xl:text-[14px] xl:leading-[1.6] xl:font-medium',
  },
  'body-12-b': {
    base: 'text-[12px] leading-[1.5] font-bold',
    sm: 'sm:text-[12px] sm:leading-[1.5] sm:font-bold',
    md: 'md:text-[12px] md:leading-[1.5] md:font-bold',
    lg: 'lg:text-[12px] lg:leading-[1.5] lg:font-bold',
    xl: 'xl:text-[12px] xl:leading-[1.5] xl:font-bold',
  },
  'body-12-m': {
    base: 'text-[12px] leading-[1.5] font-medium',
    sm: 'sm:text-[12px] sm:leading-[1.5] sm:font-medium',
    md: 'md:text-[12px] md:leading-[1.5] md:font-medium',
    lg: 'lg:text-[12px] lg:leading-[1.5] lg:font-medium',
    xl: 'xl:text-[12px] xl:leading-[1.5] xl:font-medium',
  },
} as const;

const createResponsiveClasses = (variant: ResponsiveVariants) => {
  const classes: string[] = [];

  if (variant.initial) {
    classes.push(responsiveVariantMap[variant.initial].base);
  }
  if (variant.sm) {
    classes.push(responsiveVariantMap[variant.sm].sm);
  }
  if (variant.md) {
    classes.push(responsiveVariantMap[variant.md].md);
  }
  if (variant.lg) {
    classes.push(responsiveVariantMap[variant.lg].lg);
  }
  if (variant.xl) {
    classes.push(responsiveVariantMap[variant.xl].xl);
  }

  return classes.join(' ');
};

export function Text({
  variant,
  color = 'grey-900',
  children,
  className,
  as: Component = 'p',
  ...props
}: TextProps) {
  const variantClass =
    typeof variant === 'string'
      ? responsiveVariantMap[variant].base
      : createResponsiveClasses(variant);
  const classes = `${variantClass} ${colorToClassMap[color]} ${className || ''}`;
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
