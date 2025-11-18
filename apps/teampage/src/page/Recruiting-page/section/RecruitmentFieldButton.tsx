'use client';
import Image from 'next/image';
import minus from './minus.svg';
import plus from './plus.svg';

interface RecruitmentFieldButtonProps {
  name: string;
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function RecruitmentFieldButton({ name, open, setOpen }: RecruitmentFieldButtonProps) {
  return (
    <div className="flex justify-between items-center self-stretch">
      <h5
        className={`text-[1.75rem] font-bold leading-[150%] bg-clip-text text-transparent 
          ${open ? 'bg-gradient-to-r from-blue-600 to-black' : 'bg-[#222227]'}
          max-md:text-lg max-md:font-bold max-md:leading-[160%] 
          `}
      >
        {name}
      </h5>
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
