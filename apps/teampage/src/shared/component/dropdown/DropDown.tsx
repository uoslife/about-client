'use client';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useState } from 'react';
import { Text } from '../Text';
import Image from 'next/image';

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string, index: number) => void;
  placeholder?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
}: DropdownProps) {
  const { ref } = useClickOutside<HTMLDivElement>({
    callback: () => setIsOpen(false),
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string, index: number) => {
    onChange(option, index);
    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-1.5 h-12 items-center justify-end px-2 py-0 transition-colors hover:bg-gray-50 rounded-lg"
      >
        <Text
          variant="body-18-m"
          color="grey-900"
          className="text-center whitespace-nowrap"
        >
          {value || placeholder}
        </Text>
        <Image
          src={'/svg/arrow-left.svg'}
          alt="dropdown-arrow"
          width={16}
          height={16}
          style={{
            transform: isOpen ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.1s ease-in-out',
          }}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-[16px] shadow-[0px_0px_15px_0px_rgba(18,18,18,0.05)] p-3 min-w-[160px] z-50">
          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option, index)}
                className={`flex gap-2.5 h-11 items-center justify-center px-4 py-1.5 rounded-[40px] w-full transition-colors ${
                  value === option ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Text
                  variant="body-18-m"
                  color="grey-900"
                  className="text-center whitespace-nowrap"
                >
                  {option}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
