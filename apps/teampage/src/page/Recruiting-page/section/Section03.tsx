import Image from 'next/image';

export function Section03() {
  const logos = Array.from({ length: 9 }, (_, i) => `/svg/logo/${i + 1}.svg`);
  const infiniteLogos = [...logos, ...logos];

  return (
    <>
      <section className="w-full overflow-hidden py-16 bg-white">
        <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-6 text-center px-6">
          {/* 제목 */}
          <h2 className="text-[42px] font-bold text-[#222227]">Alumni Network</h2>

          {/* 설명문 */}
          <p className="text-[18px] leading-[1.8] text-[#222227]">
            네이버, 카카오페이, 라인, 리멤버 등 국내 최고의 IT 회사부터 SKT, 현대자동차, NH투자증권, 한국은행 등 유수의
            대기업/금융권까지
            <br />
            다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.
          </p>

          {/* 캐러셀 */}
          <div className="relative w-full mt-10 overflow-hidden">
            <div className="carousel-track flex gap-8">
              {infiniteLogos.map((src, idx) => (
                <div
                  key={idx}
                  className="min-w-[200px] h-[200px] rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: 'rgba(70, 134, 255, 0.03)' }}
                >
                  <Image src={src} alt={`logo-${idx}`} width={60} height={60} className="object-contain" />
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
      </section>
    </>
  );
}
