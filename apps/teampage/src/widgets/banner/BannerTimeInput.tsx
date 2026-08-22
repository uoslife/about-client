'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * 달력 아래에 붙는 시각 입력.
 *
 * 목록에서 고르지 않는다 — 1분 단위면 항목이 1440개가 되고, 30분 단위로 줄이면
 * 실제로 쓰는 값(09:30, 23:59)을 못 고른다. 두 칸을 직접 치는 편이 빠르다.
 *
 * react-datepicker 가 `value`("HH:mm")를 주고 `onChange`("HH:mm")를 받는다.
 */

const pad = (value: number) => String(value).padStart(2, '0');

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

/** 자주 쓰는 경계. 하루의 시작·업무 시작·하루의 끝. */
const PRESETS = ['00:00', '09:00', '23:59'] as const;

const segmentClass =
  'w-9 bg-transparent text-center text-body-16-m text-grey-900 tabular-nums outline-none';

interface BannerTimeInputProps {
  /** `HH:mm` */
  value?: string;
  onChange?: (time: string) => void;
}

export function BannerTimeInput({ value, onChange }: BannerTimeInputProps) {
  const [hour, minute] = (value ?? '00:00').split(':');
  const [draft, setDraft] = useState({ hour, minute });
  const minuteRef = useRef<HTMLInputElement>(null);

  /**
   * blur 는 리렌더 전에 터진다. 시(時) 두 자리를 채워 분으로 포커스를 옮기면 그
   * 순간 시의 blur 가 도는데, state 로 읽으면 방금 친 숫자가 없는 낡은 값이 커밋된다.
   */
  const draftRef = useRef(draft);
  const write = (next: { hour: string; minute: string }) => {
    draftRef.current = next;
    setDraft(next);
  };

  // 달력에서 날짜를 바꾸면 react-datepicker 가 새 value 를 내려준다.
  useEffect(() => {
    write({ hour, minute });
  }, [hour, minute]);

  const commit = (next: { hour: string; minute: string }) => {
    const h = pad(clamp(Number(next.hour) || 0, 23));
    const m = pad(clamp(Number(next.minute) || 0, 59));
    write({ hour: h, minute: m });
    onChange?.(`${h}:${m}`);
  };

  const step = (unit: 'hour' | 'minute', delta: number) => {
    const max = unit === 'hour' ? 23 : 59;
    const current = Number(draftRef.current[unit]) || 0;
    const wrapped = (current + delta + max + 1) % (max + 1);
    commit({ ...draftRef.current, [unit]: pad(wrapped) });
  };

  const onSegmentKeyDown =
    (unit: 'hour' | 'minute') => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        step(unit, 1);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        step(unit, -1);
      }
    };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-grey-300 bg-white px-2 py-[6px] focus-within:border-primary-ui focus-within:ring-1 focus-within:ring-primary-ui">
        <input
          className={segmentClass}
          inputMode="numeric"
          maxLength={2}
          aria-label="시"
          value={draft.hour}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
            const next = { ...draftRef.current, hour: digits };

            // 두 자리를 채우면 분으로 넘긴다. 탭을 누르지 않아도 이어 칠 수 있다.
            if (digits.length === 2) {
              commit(next);
              minuteRef.current?.focus();
              return;
            }
            write(next);
          }}
          onBlur={() => commit(draftRef.current)}
          onKeyDown={onSegmentKeyDown('hour')}
        />
        <span className="text-body-16-m text-grey-500" aria-hidden>
          :
        </span>
        <input
          ref={minuteRef}
          className={segmentClass}
          inputMode="numeric"
          maxLength={2}
          aria-label="분"
          value={draft.minute}
          onChange={(e) =>
            write({
              ...draftRef.current,
              minute: e.target.value.replace(/\D/g, '').slice(0, 2),
            })
          }
          onBlur={() => commit(draftRef.current)}
          onKeyDown={onSegmentKeyDown('minute')}
        />
      </div>

      <div className="flex items-center gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className="rounded-md px-2 py-1 text-body-12-m text-grey-600 transition-colors hover:bg-grey-100 hover:text-grey-900"
            onClick={() => {
              const [h, m] = preset.split(':');
              commit({ hour: h, minute: m });
            }}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
