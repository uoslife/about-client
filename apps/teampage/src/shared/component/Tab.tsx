import { type ColorValue, Text } from './Text';

interface TabProps {
  children: React.ReactNode;
  color: 'light' | 'dark';
}

export function Tab({ children, color }: TabProps) {
  const currentColor = colorClass[color] ?? colorClass.light;

  return (
    <button
      className={`flex items-center h-11 justify-center px-[26px] py-0 rounded-[22px] transition-colors ${currentColor?.background ?? ''} ${currentColor?.hoverBackground ?? ''} ${currentColor?.hoverText ?? ''} ${currentColor?.pressedText ?? ''} ${currentColor?.pressedBackground ?? ''}`}
    >
      <Text variant="body-20-m" color={currentColor?.text}>
        {children}
      </Text>
    </button>
  );
}

type TabColorProps = {
  background?: string;
  text?: ColorValue;
  hoverText?: string;
  hoverBackground?: string;
  pressedText?: string;
  pressedBackground?: string;
};

const colorClass: Record<'light' | 'dark', TabColorProps> = {
  light: {
    text: 'grey-600',
    hoverText: 'hover:text-[#303037]',
    hoverBackground: 'hover:bg-[#e1e1e7]',
    pressedText: 'active:text-white',
    pressedBackground: 'active:bg-[#222227]',
  },
  dark: {
    text: 'grey-600',
    background: 'bg-[#303037]',
    hoverText: 'hover:text-[#54545c]',
    hoverBackground: 'hover:bg-[#d5d5dc]',
    pressedText: 'active:text-[#222227]',
    pressedBackground: 'active:bg-[#f7f7f9]',
  },
} as const;
