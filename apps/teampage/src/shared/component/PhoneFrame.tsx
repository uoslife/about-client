import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[864px] w-full max-w-[410px] rounded-[40px] bg-[#0f172a] p-[10px] shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
      <div className="h-full w-full overflow-y-auto rounded-[32px] bg-white">{children}</div>
    </div>
  );
}
