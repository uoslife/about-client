import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type FieldStatus = 'default' | 'success' | 'error';

const BORDER: Record<FieldStatus, string> = {
  default: 'border-[#e2e8f0] focus:border-[#266efb]',
  success: 'border-[#266efb]',
  error: 'border-[#ef4444]',
};

const HELP_COLOR: Record<FieldStatus, string> = {
  default: 'text-[#64748b]',
  success: 'text-[#266efb]',
  error: 'text-[#ef4444]',
};

export const fieldInputClassName = (status: FieldStatus) =>
  `w-full border-b bg-transparent py-[6px] text-[17px] font-medium leading-[1.5] text-[#0f172a] caret-[#266efb] outline-none placeholder:text-[#94a3b8] ${BORDER[status]}`;

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-medium leading-[1.3] text-[#334155]">
      {children}
    </label>
  );
}

export function HelpText({ status, children }: { status: FieldStatus; children: ReactNode }) {
  return <p className={`ml-[4px] mt-[4px] text-[12px] font-medium leading-[1.3] ${HELP_COLOR[status]}`}>{children}</p>;
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  /** 라벨을 화면에 안 보일 때 스크린리더용 이름 */
  srLabel?: string;
  status?: FieldStatus;
  helpText?: string;
  suffix?: ReactNode;
};

export function TextField({
  label,
  srLabel,
  status = 'default',
  helpText,
  suffix,
  id,
  className,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={`flex min-w-0 flex-col gap-[4px] ${className ?? ''}`}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          aria-label={label ? undefined : srLabel}
          aria-invalid={status === 'error' || undefined}
          className={`${fieldInputClassName(status)} ${suffix ? 'pr-[28px]' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[17px] font-medium text-[#64748b]">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <HelpText status={status}>{helpText}</HelpText>}
    </div>
  );
}
