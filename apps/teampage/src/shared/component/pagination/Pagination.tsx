'use client';

import { Text } from '@/shared/component/Text';

// SVG Icon Components
const DoubleLeftArrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Double Left Arrow</title>
    <path
      d="M11 17L6 12L11 7"
      stroke="#72727C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 17L13 12L18 7"
      stroke="#72727C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LeftArrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Left Arrow</title>
    <path
      d="M15 18L9 12L15 6"
      stroke="#72727C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Right Arrow</title>
    <path
      d="M9 18L15 12L9 6"
      stroke="#222227"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoubleRightArrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Double Right Arrow</title>
    <path
      d="M13 17L18 12L13 7"
      stroke="#222227"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 17L11 12L6 7"
      stroke="#222227"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pageNumbers: number[] = [];
  const MAX_PAGES_TO_SHOW = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES_TO_SHOW / 2));
  const endPage = Math.min(totalPages, startPage + MAX_PAGES_TO_SHOW - 1);

  if (endPage - startPage + 1 < MAX_PAGES_TO_SHOW) {
    startPage = Math.max(1, endPage - MAX_PAGES_TO_SHOW + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      className={`flex justify-center items-center gap-5 ${className || ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-full disabled:opacity-50"
        >
          <DoubleLeftArrow />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-full disabled:opacity-50"
        >
          <LeftArrow />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {pageNumbers.map((number) => (
          <button
            type="button"
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
              currentPage === number ? 'bg-grey-900' : 'hover:bg-grey-100'
            }`}
          >
            <Text
              variant="body-18-m"
              color={currentPage === number ? 'white' : 'grey-600'}
            >
              {number}
            </Text>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-full disabled:opacity-50"
        >
          <RightArrow />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-full disabled:opacity-50"
        >
          <DoubleRightArrow />
        </button>
      </div>
    </nav>
  );
}
