'use client';

import Image from 'next/image';
import type { InputHTMLAttributes, KeyboardEventHandler } from 'react';
import { useState } from 'react';

interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'large' | 'small';
  onClear?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export function SearchField({
  size = 'large',
  className,
  onFocus,
  onBlur,
  onClear,
  onKeyDown,
  ...props
}: SearchFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const sizeClasses = {
    large: 'h-[56px] px-6',
    small: 'h-[48px] w-[300px] px-5',
  };

  const inputSizeClasses = {
    large: 'text-body-18-m text-sm md:text-lg',
    small: 'text-body-16-m text-sm md:text-base',
  };

  const CloseIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>close icon</title>
      <path
        d="M18 6L6 18"
        stroke="#222227"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="#222227"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      className={`
        flex items-center gap-3 bg-grey-50 rounded-full
        ${sizeClasses[size]}
        ${isFocused ? 'border border-grey-900' : 'border border-transparent'}
        ${className || ''}
      `}
    >
      <Image src="/svg/search.svg" alt="search icon" width={24} height={24} />
      <input
        type="text"
        className={`
          w-full bg-transparent outline-none
          ${inputSizeClasses[size]}
          ${
            props.value
              ? 'text-grey-900'
              : 'text-grey-600 placeholder:text-grey-600'
          }
        `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {props.value && (
        <button type="button" onClick={onClear} className="flex-shrink-0">
          {CloseIcon}
        </button>
      )}
    </div>
  );
}
