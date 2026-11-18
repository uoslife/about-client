import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type Size = 'xs' | 's' | 'm';
type Variant = 'fill' | 'weak' | 'outlined' | 'text';
type Color = 'blue' | 'gray' | 'red';

const SIZE: Record<Size, string> = {
  xs: 'h-[32px] px-[10px] gap-[4px] rounded-[8px] text-[13px] leading-[1.3]',
  s: 'h-[38px] px-[12px] gap-[4px] rounded-[8px] text-[15px] leading-[1.3]',
  m: 'h-[48px] px-[16px] gap-[8px] rounded-[10px] text-[17px] leading-[1.3]',
};

const ICON_SIZE: Record<Size, number> = { xs: 14, s: 16, m: 18 };

const COLOR: Record<Variant, Record<Color, string>> = {
  fill: {
    blue: 'bg-[#266efb] text-white',
    gray: 'bg-[#64748b] text-white',
    red: 'bg-[#ef4444] text-white',
  },
  weak: {
    blue: 'bg-[#DAE8FF] text-[#1f58f1]',
    gray: 'bg-[#f1f5f9] text-[#334155]',
    red: 'bg-[#fee2e2] text-[#dc2626]',
  },
  outlined: {
    blue: 'border border-[#1f58f1] bg-white text-[#1f58f1]',
    gray: 'border border-[#cbd5e1] bg-white text-[#334155]',
    red: 'border border-[#dc2626] bg-white text-[#dc2626]',
  },
  text: {
    blue: 'bg-transparent text-[#1f58f1]',
    gray: 'bg-transparent text-[#334155]',
    red: 'bg-transparent text-[#dc2626]',
  },
};

type ButtonStyleProps = { size?: Size; variant?: Variant; color?: Color; fullWidth?: boolean };

export const buttonClassName = ({ size = 'xs', variant = 'weak', color = 'blue', fullWidth }: ButtonStyleProps) =>
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-transform',
    'active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a8afc]',
    variant === 'weak' ? 'disabled:opacity-[0.46]' : 'disabled:opacity-[0.31]',
    'disabled:cursor-not-allowed disabled:active:scale-100',
    variant === 'weak' ? 'font-medium' : 'font-semibold',
    SIZE[size],
    COLOR[variant][color],
    fullWidth ? 'w-full' : '',
  ].join(' ');

type ButtonProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & { icon?: IconName; children: ReactNode };

export function Button({ size = 'xs', variant, color, fullWidth, icon, className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${buttonClassName({ size, variant, color, fullWidth })} ${className ?? ''}`}
      {...props}
    >
      {icon && <Icon name={icon} size={ICON_SIZE[size]} />}
      {children}
    </button>
  );
}

/** 아이콘만 있는 버튼. DS TextField 지우기 버튼처럼 회색 아이콘을 쓴다. */
export function IconButton({
  icon,
  label,
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center text-[#94a3b8] hover:text-[#64748b] ${className ?? ''}`}
      {...props}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
