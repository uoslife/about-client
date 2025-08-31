import type { PropsWithChildren } from 'react';

export function ArticleMainSectionContainer({
  children,
  className,
  ...props
}: {
  children: PropsWithChildren;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      className={`w-full mx-auto max-w-pc flex flex-col gap-8 ${className || ''}`}
      {...props}
    >
      {children}
    </main>
  );
}
