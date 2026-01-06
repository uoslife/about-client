import { type ColorValue, Text } from './Text';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'light' | 'dark';
  clicked: boolean;
}

export function TabButton({ children, color = 'light', clicked, className, ...props }: TabButtonProps) {
  const styles: Record<'light' | 'dark', { default: string; clicked: string; textColor: ColorValue }> = {
    light: {
      default: 'text-[#8E8E93] hover:bg-[#E1E1E7] hover:text-[#54545C]',
      clicked: 'text-black',
      textColor: clicked ? 'black' : 'grey-600',
    },
    dark: {
      default: 'bg-[#8E8E93] hover:bg-[#E1E1E7] hover:text-[#54545C]',
      clicked: 'text-black',
      textColor: clicked ? 'black' : 'grey-600',
    },
  };

  const currentStyle = styles[color];
  const stateClass = clicked ? currentStyle.clicked : currentStyle.default;

  return (
    <button
      type="button"
      className={`flex items-center justify-center px-2 ${stateClass} ${className || ''}`}
      {...props}
    >
      <Text
        variant={{ initial: 'body-14-b', sm: 'body-20-m' }}
        color={currentStyle.textColor}
        className="max-md:text-body-14-m"
      >
        {children}
      </Text>
    </button>
  );
}
