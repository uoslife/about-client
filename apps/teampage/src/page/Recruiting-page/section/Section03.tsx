import Image from 'next/image';

export function Section03() {
  const logos = Array.from({ length: 9 }, (_, i) => `/svg/logo/${i + 1}.svg`);
  const infiniteLogos = [...logos, ...logos];

  return (
    <>
      <div className="flex flex-col items-center gap-[60px] self-stretch pb-[160px]">
        <div className="flex flex-col items-center gap-8 self-stretch">
          {/* 제목 */}
          <h2 className="text-[#222227] text-center font-['Pretendard'] text-[40px] font-bold leading-[140%]">
            Alumni Network
          </h2>
          <p className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%]">
            네이버, 카카오페이, 라인, 리멤버 등 국내 최고의 IT 회사부터 SKT, 현대자동차, NH투자증권, 한국은행 등 유수의
            대기업/금융권까지
            <br />
            다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.
          </p>
        </div>

        {/* 캐러셀 */}
        <div className="relative w-full overflow-hidden">
          <div className="carousel-track flex gap-[20px]">
            {infiniteLogos.map((src, idx) => (
              <div
                key={idx}
                className="min-w-[200px] h-[200px]
                flex  flex-col justify-center items-center gap-2.5 rounded-[20px] bg-[rgba(70,134,255,0.03)]"
                style={{ background: 'rgba(70, 134, 255, 0.03)' }}
              >
                <Image src={src} alt={`logo-${idx}`} width={60} height={60} />
              </div>
            ))}
          </div>

          <style jsx>{`
            .carousel-track {
              display: flex;
              animation: slide 25s linear infinite;
              will-change: transform;
            }

            @keyframes slide {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
