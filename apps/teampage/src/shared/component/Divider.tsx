interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'px' | '1' | '2' | '4' | '8';
  color?: string;
}

export function Divider({
  orientation = 'horizontal',
  thickness = 'px',
  color = 'bg-gray-300',
  className,
  ...props
}: DividerProps) {
  const orientationClass = orientation === 'horizontal' ? 'w-full' : 'h-full';
  const thicknessClass =
    orientation === 'horizontal' ? `h-${thickness}` : `w-${thickness}`;

  const classes = `${orientationClass} ${thicknessClass} ${color} ${className || ''}`;

  return <div className={classes} {...props} />;
}
