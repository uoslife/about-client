import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import {
  recruitingAssets,
  recruitingMentorSectionHeading,
  recruitingSection02,
} from '@/page/Recruiting-page/config';

export function Section02() {
  const { mentors } = recruitingSection02;

  return (
    <>
      <div
        className={twMerge(
          'flex items-start w-[100%] flex-row gap-[13.25rem] pb-60 px-20 pt-[100px] max-lg:flex-col max-lg:px-[16px] max-lg:gap-7 max-lg:w-[100%] max-lg:justify-center max-lg:pt-[80px] max-lg:pb-[120px]',
        )}
      >
        <div className="flex flex-col items-start gap-5">
          <h2
            className="whitespace-nowrap font-['Pretendard'] text-[48px] font-bold leading-[140%] self-stretch bg-gradient-to-r from-black via-[#0F6EFB] to-[#AACEFF] bg-clip-text text-transparent 
          max-md:text-[24px] max-md:leading-[150%]"
          >
            {recruitingSection02.teamHeading}
          </h2>
          <Link href={recruitingSection02.learnMoreHref} className="flex p-1 items-center gap-1">
            {recruitingSection02.learnMoreLabel}
            <div className="text-[#54545C] font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]">
              <Image src={recruitingAssets.angleBracket} alt="bracket" width={8} height={8} />
            </div>
          </Link>
        </div>
        <div className="text-[#303037] font-['Pretendard'] text-xl font-medium leading-[160%] gap-5 flex flex-col">
          {recruitingSection02.introParagraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-[#303037] font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div
        className={twMerge(
          'flex flex-col',
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(70,134,255,0.07)_80%,rgba(255,255,255,0.07)_100%)]',
        )}
      >
        <div
          className={twMerge(
            'flex flex-col items-center gap-10 text-center pb-40 max-lg:w-[100%] max-lg:px-[16px] max-lg:pb-[60px] max-lg:gap-[16px]',
          )}
        >
          <h2 className="text-[#222227] text-center font-['Pretendard'] text-[72px] font-bold leading-[120%] max-md:text-[32px] max-md:leading-[140%]">
            {recruitingSection02.synergizeHeadingLine1} <br className="md:hidden" />
            {recruitingSection02.synergizeHeadingLine2}
          </h2>
          <div className="w-2/3 max-md:w-[100%]">
            {recruitingSection02.synergizeParagraphs.map((line, idx) => (
              <p
                key={idx}
                className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] self-stretch max-md:text-[14px]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="flex w-2/3 flex-col items-center gap-[60px] md:mx-auto pb-40 max-md:gap-[24px] max-md:px-[16px] max-md:w-[100%] max-md:pb-[60px]">
          <h2
            className="text-[40px] text-center leading-[140%] font-bold text-[#222227] max-md:text-[20px]
        max-md:leading-[160%]"
          >
            {recruitingMentorSectionHeading()}
          </h2>
          <div className="grid w-full grid-cols-2 gap-[20px] lg:grid-cols-4">
            {mentors.map((person, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl py-6 px-9 justify-center items-center gap-7 border-[1.5px] border-white shadow-[0_0_16px_0_rgba(70,134,255,0.12)] max-md:py-[12px] max-md:px-[24px] max-md:gap-[12px]"
              >
                <Image
                  src={person.src}
                  alt={`${person.name} 멘토`}
                  width={200}
                  height={200}
                  className="rounded-full max-md:w-[100px] max-md:h-[100px]"
                />
                <div className="flex flex-col items-center gap-3 max-md:gap-[4px]">
                  <div className="flex flex-col items-center self-stretch">
                    <p className="text-[#222227] text-center font-['Pretendard'] text-[28px] font-bold leading-[150%] max-md:text-[18px] max-md:leading-[160%]">
                      {person.company}
                    </p>
                    <p className="text-[#54545C] text-center font-['Pretendard'] text-lg font-medium leading-[160%] self-stretch max-md:text-[14px] max-md:leading-[160%]">
                      {person.role}
                    </p>
                  </div>

                  <p className="text-[#303037] text-center font-['Pretendard'] text-xl font-bold leading-[160%] self-stretch max-md:text-[14px]">
                    {person.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
