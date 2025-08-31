import { type ColorValue, Text } from './Text';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'light' | 'dark';
  clicked: boolean;
}

export function TabButton({
  children,
  color = 'light',
  clicked,
  className,
  ...props
}: TabButtonProps) {
  const styles: Record<
    'light' | 'dark',
    { default: string; clicked: string; textColor: ColorValue }
  > = {
    light: {
      default: 'text-[#72727c] hover:bg-[#e1e1e7] hover:text-[#303037]',
      clicked: 'bg-[#222227] text-white',
      textColor: clicked ? 'white' : 'grey-600',
    },
    dark: {
      default:
        'bg-[#303037] text-white hover:bg-[#d5d5dc] hover:text-[#54545c]',
      clicked: 'bg-[#f7f7f9] text-[#222227]',
      textColor: clicked ? 'grey-900' : 'white',
    },
  };

  const currentStyle = styles[color];
  const stateClass = clicked ? currentStyle.clicked : currentStyle.default;

  return (
    <button
      type="button"
      className={`flex items-center h-11 justify-center px-[26px] py-0 rounded-[22px] transition-colors ${stateClass} ${className || ''}`}
      {...props}
    >
      <Text variant="body-20-m" color={currentStyle.textColor}>
        {children}
      </Text>
    </button>
  );
}
