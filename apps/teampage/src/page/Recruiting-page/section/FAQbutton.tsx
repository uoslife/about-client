'use client';
import Image from 'next/image';
import minus from './minus.svg';
import plus from './plus.svg';

interface FAQbuttonProps {
  question: string;
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function FAQbutton({ question, open, setOpen }: FAQbuttonProps) {
  return (
    <div className="flex justify-between items-center self-stretch py-5">
      <h4 className="text-[#222227] text-[1.75rem] font-bold leading-[150%]">
        {question}
      </h4>
      <button
        className="flex justify-between items-center self-stretch py-5"
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        <div className="flex flex-col justify-center items-center w-6 h-6 gap-2.5 flex-shrink-0">
          <Image src={open == true ? minus : plus} alt="펼치기 버튼" />
        </div>
      </button>
    </div>
  );
}
