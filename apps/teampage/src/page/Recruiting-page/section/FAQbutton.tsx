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
    <div
      className="flex justify-between items-center self-stretch py-5
    max-md:py-1"
    >
      <h4 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] max-md:text-lg max-md:leading-[160%]">
        {question}
      </h4>
      <button
        className="flex w-10 h-10 p-2.5 justify-center items-center gap-2.5 aspect-square rounded-full max-md:w-8 max-md:h-8 max-md:p-2 max-md:gap-2"
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        <div className="flex flex-col justify-center items-center w-6 h-6 gap-2.5 flex-shrink-0 max-md:w-[1.2rem] max-md:h-[1.2rem] max-md:gap-2">
          <Image src={open == true ? minus : plus} alt="펼치기 버튼" />
        </div>
      </button>
    </div>
  );
}
