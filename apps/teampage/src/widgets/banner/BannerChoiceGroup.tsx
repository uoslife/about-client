'use client';
import { useRef } from 'react';

export interface BannerChoiceOption {
  value: string;
  label: string;
  /** 변수 정의에 없는 예약값. 점선 테두리로 구분한다. */
  reserved?: boolean;
  disabled?: boolean;
}

interface BannerChoiceGroupBaseProps {
  /** 그룹 자체의 접근 이름. 화면에는 그리지 않는다. */
  label: string;
  options: BannerChoiceOption[];
  disabled?: boolean;
}

type BannerChoiceGroupProps = BannerChoiceGroupBaseProps &
  (
    | { mode: 'single'; value: string; onChange: (value: string) => void }
    | { mode: 'multiple'; values: string[]; onChange: (value: string) => void }
  );

const BASE_CLASS =
  'rounded-full border px-4 py-[6px] text-body-14-m outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-ui focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40';

const toneClass = (selected: boolean, reserved: boolean) => {
  if (selected) {
    return reserved
      ? 'border-dashed border-primary-ui bg-primary-lighter-alt text-primary-ui'
      : 'border-primary-ui bg-primary-ui text-white';
  }
  return reserved
    ? 'border-dashed border-grey-400 bg-white text-grey-600 hover:bg-grey-50'
    : 'border-grey-300 bg-white text-grey-700 hover:bg-grey-50';
};

/**
 * 선택 컨트롤. native radio/checkbox 대신 pill 버튼을 쓴다.
 *
 * native 를 버리면 접근성도 같이 사라지므로 role/aria 와 방향키 이동을 직접 채운다.
 */
export function BannerChoiceGroup(props: BannerChoiceGroupProps) {
  const { label, options, disabled } = props;
  const groupRef = useRef<HTMLDivElement>(null);

  const isSelected = (value: string) =>
    props.mode === 'single' ? props.value === value : props.values.includes(value);

  const enabled = options.filter((option) => !option.disabled && !disabled);
  // 선택된 것이 없으면 첫 칸이 탭 정지점이 된다. 그렇지 않으면 그룹에 진입할 수 없다.
  const tabStop = enabled.find((option) => isSelected(option.value))?.value ?? enabled[0]?.value;

  const moveFocus = (fromIndex: number, step: 1 | -1) => {
    if (enabled.length === 0) return;
    const current = enabled.findIndex((option) => option.value === options[fromIndex].value);
    const next = enabled[(current + step + enabled.length) % enabled.length];
    props.onChange(next.value);
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-choice="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div
      ref={groupRef}
      role={props.mode === 'single' ? 'radiogroup' : 'group'}
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            data-choice={option.value}
            disabled={isDisabled}
            role={props.mode === 'single' ? 'radio' : undefined}
            aria-checked={props.mode === 'single' ? selected : undefined}
            aria-pressed={props.mode === 'multiple' ? selected : undefined}
            tabIndex={props.mode === 'single' && option.value !== tabStop ? -1 : undefined}
            onKeyDown={(event) => {
              if (props.mode !== 'single' || isDisabled) return;
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveFocus(index, 1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                moveFocus(index, -1);
              }
            }}
            onClick={() => props.onChange(option.value)}
            className={`${BASE_CLASS} ${toneClass(selected, Boolean(option.reserved))}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
