import { useId, type SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { FieldLabel, fieldInputClassName } from './TextField';

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label: string;
  options: { value: string; label: string }[];
};

export function SelectField({ label, options, id, className, ...props }: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={`flex min-w-0 flex-col gap-[4px] ${className ?? ''}`}>
      <FieldLabel htmlFor={selectId}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={selectId}
          className={`${fieldInputClassName('default')} cursor-pointer appearance-none pr-[24px]`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="keyboardArrowDown"
          size={20}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#e2e8f0]"
        />
      </div>
    </div>
  );
}
