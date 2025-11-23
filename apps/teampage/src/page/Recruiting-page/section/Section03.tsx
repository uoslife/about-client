import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export function Section03() {
  const logos = Array.from({ length: 11 }, (_, i) => `/svg/logo/${i + 1}.svg`);

  // 모바일용 2줄 분할
  const firstRow = logos.slice(0, 6); // 5개
  const secondRow = logos.slice(6); // 4개

  return (
    <div
      className={twMerge(
        'flex flex-col items-center gap-[60px] self-stretch pb-[160px] max-md:gap-[24px] max-md:pb-[60px]',
      )}
    >
      <div className="flex flex-col items-center gap-8 self-stretch max-md:gap-[12px]">
        {/* 제목 */}
        <h2
          className="text-[#222227] text-center font-['Pretendard'] text-[40px] font-bold leading-[140%]
         max-md:text-[20px] max-md:leading-[160%]        
        "
        >
          Alumni Network
        </h2>
        <p
          className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]
        "
        >
          네이버, 카카오페이, 라인, 리멤버 등 국내 최고의 IT 회사부터 SKT, 현대자동차, NH투자증권, 한국은행 등 유수의
          대기업/금융권까지
          <br className="hidden lg:block" />
          다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.
        </p>
      </div>

      {/* 데스크톱: 1줄 캐러셀 (왼쪽으로 이동) */}
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

      {/* 모바일: 2줄 캐러셀 (반대 방향) */}
      <div className="relative w-full overflow-hidden md:hidden flex flex-col gap-[12px]">
        {/* 첫 번째 줄 (왼쪽으로 이동) */}
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

        {/* 두 번째 줄 (오른쪽으로 이동) */}
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
            transform: translateX(calc((-200px - 20px) * 9));
          }
        }

        @keyframes scroll-left-mobile-first {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc((-120px - 12px) * 5));
          }
        }

        @keyframes scroll-right-mobile-second {
          0% {
            transform: translateX(calc((-120px - 12px) * 4));
          }
          100% {
            transform: translateX(0);
          }
        }

        .carousel-track {
          animation: scroll-left 20s linear infinite;
          will-change: transform;
        }

        .carousel-track-left {
          animation: scroll-left-mobile-first 15s linear infinite;
          will-change: transform;
        }

        .carousel-track-right {
          animation: scroll-right-mobile-second 15s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
