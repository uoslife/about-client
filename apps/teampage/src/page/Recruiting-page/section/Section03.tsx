import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { recruitingSection03 } from '@/page/Recruiting-page/config';

export function Section03() {
  const { logoSvgCount, carousel } = recruitingSection03;
  const logos = Array.from({ length: logoSvgCount }, (_, i) => `/svg/logo/${i + 1}.svg`);

  const firstRow = logos.slice(0, 6);
  const secondRow = logos.slice(6);

  const desk = carousel.desktop;
  const r1 = carousel.mobileRow1;
  const r2 = carousel.mobileRow2;

  const desktopTranslate = `calc((-${desk.tilePx}px - ${desk.gapPx}px) * ${desk.loopTiles})`;
  const mobileRow1Translate = `calc((-${r1.tilePx}px - ${r1.gapPx}px) * ${r1.loopTiles})`;
  const mobileRow2Start = `calc((-${r2.tilePx}px - ${r2.gapPx}px) * ${r2.loopTiles})`;

  return (
    <div
      className={twMerge(
        'flex flex-col items-center gap-[60px] self-stretch pb-[160px] max-md:gap-[24px] max-md:pb-[60px]',
      )}
    >
      <div className="flex flex-col items-center gap-8 self-stretch max-md:gap-[12px]">
        <h2
          className="text-[#222227] text-center font-['Pretendard'] text-[40px] font-bold leading-[140%]
          max-md:text-[20px] max-md:leading-[160%]        
        "
        >
          {recruitingSection03.title}
        </h2>
        <p
          className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px] max-md:px-4
        "
        >
          {recruitingSection03.description}
          <br className="hidden lg:block" />
          {recruitingSection03.descriptionContinued}
        </p>
      </div>

      <div className="relative w-full overflow-hidden max-md:hidden">
        <div className="carousel-track flex gap-[20px]">
          {[...logos, ...logos].map((src, idx) => (
            <div
              key={`desktop-${idx}`}
              className="flex-shrink-0 w-[200px] h-[200px]
                flex flex-col justify-center items-center gap-2.5 rounded-[20px] bg-[rgba(70,134,255,0.03)]"
            >
              <Image src={src} alt={`logo-${idx % logos.length}`} width={60} height={60} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden md:hidden flex flex-col gap-[12px]">
        <div className="carousel-track-left flex gap-[12px]">
          {[...firstRow, ...firstRow].map((src, idx) => (
            <div
              key={`row1-${idx}`}
              className="flex-shrink-0 w-[120px] h-[120px]
                flex flex-col justify-center items-center gap-2.5 rounded-[12px] bg-[rgba(70,134,255,0.03)]"
            >
              <Image src={src} alt={`logo-${idx % firstRow.length}`} width={40} height={40} />
            </div>
          ))}
        </div>

        <div className="carousel-track-right flex gap-[12px]">
          {[...secondRow, ...secondRow].map((src, idx) => (
            <div
              key={`row2-${idx}`}
              className="flex-shrink-0 w-[120px] h-[120px]
                flex flex-col justify-center items-center gap-2.5 rounded-[12px] bg-[rgba(70,134,255,0.03)]"
            >
              <Image src={src} alt={`logo-${idx % secondRow.length}`} width={40} height={40} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${desktopTranslate});
          }
        }

        @keyframes scroll-left-mobile-first {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${mobileRow1Translate});
          }
        }

        @keyframes scroll-right-mobile-second {
          0% {
            transform: translateX(${mobileRow2Start});
          }
          100% {
            transform: translateX(0);
          }
        }

        .carousel-track {
          animation: scroll-left ${desk.durationSec}s linear infinite;
          will-change: transform;
        }

        .carousel-track-left {
          animation: scroll-left-mobile-first ${r1.durationSec}s linear infinite;
          will-change: transform;
        }

        .carousel-track-right {
          animation: scroll-right-mobile-second ${r2.durationSec}s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
