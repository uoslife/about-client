import Link from 'next/link';

export function Section03() {
  return (
    <>
      {' '}
      <section className="w-full px-6 py-24 bg-[#f9f9fb]">
        <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-12 text-center">
          <h2 className="text-[36px] font-bold text-[#222227]">
            더 궁금한 게 있다면
            <br />
            아래를 통해 문의해 주세요
          </h2>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {/* 카드 1 */}
            <Link
              href="#"
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-10 text-left shadow-md transition hover:shadow-lg min-h-[200px]"
            >
              <p className="text-[24px] font-bold text-[#222227] leading-[1.5]">
                <span className="text-[#0F6EFB]">UOSLIFE</span>에 궁금한 점이나
                <br />
                의견이 있다면?
              </p>
              <p className="mt-6 text-[16px] text-[#666666]">시대생 카카오톡 채널 바로가기 ›</p>
            </Link>

            {/* 카드 2 */}
            <Link
              href="#"
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-10 text-left shadow-md transition hover:shadow-lg min-h-[200px]"
            >
              <p className="text-[24px] font-bold text-[#222227] leading-[1.5]">
                <span className="text-[#0F6EFB]">UOSLIFE</span>의 실시간 소식을
                <br />
                알고 싶다면?
              </p>
              <p className="mt-6 text-[16px] text-[#666666]">시대생 인스타그램 바로가기 ›</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
