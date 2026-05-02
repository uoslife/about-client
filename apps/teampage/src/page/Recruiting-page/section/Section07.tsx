import Image from 'next/image';
import Link from 'next/link';

import { recruitingAssets, recruitingSection07 } from '@/page/Recruiting-page/config';

export function Section07() {
  const c = recruitingSection07;
  return (
    <>
      <div className="flex flex-col items-start gap-20 self-stretch py-60 px-20 max-md:px-4 max-md:py-[84px] max-md:gap-7 max-xl:px-[10%] ">
        <h2 className="text-[#222227] font-pretendard text-[72px] leading-[120%] self-stretch max-md:text-[32px] font-bold max-md:leading-[140%]">
          {c.headlineLine1}
          <br />
          {c.headlineLine2}
        </h2>

        <div className="flex items-center gap-10 self-stretch max-md:gap-2">
          <Link
            href={c.kakaoHref}
            target="_blank"
            className="flex h-[400px] p-12 flex-col justify-between items-start flex-1 rounded-[20px] bg-white/80 shadow-[0_0_16px_0_rgba(70,134,255,0.12)] max-md:h-60 max-md:p-4 max-md:rounded-lg"
          >
            <p
              className="self-stretch opacity-95 text-[#222227] font-['Pretendard'] text-[40px] font-bold leading-[140%] max-md:text-xl max-md:leading-[160%]
            "
            >
              <span className="text-[#4686FF]">{c.brandAccentName}</span>
              {c.kakaoCardTitleSuffix}
            </p>

            <div className="flex items-center gap-2 max-md:gap-1 max-md:self-stretch">
              <p
                className="text-[#54545C] font-['Pretendard'] text-xl font-bold leading-[160%]
              max-md:flex-1 max-md:text-sm 
              "
              >
                {c.kakaoCardLinkLabel}
              </p>
              <div className="flex w-6 h-6 justify-center items-center gap-2.5 max-md:w-4 max-md:h-4 max-md:gap-[6.667px]">
                <Image src={recruitingAssets.angleBracket} alt="bracket" width={8} height={8} />
              </div>
            </div>
          </Link>

          <Link
            href={c.instagramHref}
            target="_blank"
            className="flex h-[400px] p-12 flex-col justify-between items-start flex-1 rounded-[20px] bg-white/80 shadow-[0_0_16px_0_rgba(70,134,255,0.12)] max-md:h-60 max-md:p-4 max-md:rounded-lg"
          >
            <p className="self-stretch opacity-95 text-[#222227] font-['Pretendard'] text-[40px] font-bold leading-[140%] max-md:text-xl max-md:leading-[160%]">
              <span className="text-[#4686FF]">{c.brandAccentName}</span>
              {c.instagramCardTitleSuffix}
            </p>
            <div
              className="flex items-center gap-2
            max-md:gap-1 max-md:self-stretch"
            >
              <p className="text-[#54545C] font-['Pretendard'] text-xl font-bold leading-[160%] max-md:flex-1 max-md:text-sm ">
                {c.instagramCardLinkLabel}
              </p>
              <div
                className="flex w-6 h-6 justify-center items-center gap-2.5
              max-md:w-4 max-md:h-4 max-md:gap-[6.667px]
              "
              >
                <Image src={recruitingAssets.angleBracket} alt="bracket" width={8} height={8} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
