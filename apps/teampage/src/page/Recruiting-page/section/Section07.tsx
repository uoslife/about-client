import Link from 'next/link';
import Image from 'next/image';

export function Section07() {
  return (
    <>
      <div className="flex flex-col items-start gap-20 self-stretch py-60 px-80">
        <h2 className="text-[#222227] font-pretendard text-[72px] font-bold leading-[120%] self-stretch">
          더 궁금한 게 있다면
          <br />
          아래를 통해 문의해 주세요
        </h2>

        <div className="flex items-center gap-10 self-stretch">
          {/* 카드 1 */}
          <Link
            href="#"
            className="flex h-[400px] p-12 flex-col justify-between items-start flex-1 rounded-[20px] bg-white/80 shadow-[0_0_16px_0_rgba(70,134,255,0.12)]"
          >
            <p className="self-stretch opacity-95 text-[#222227] font-['Pretendard'] text-[40px] font-bold leading-[140%]">
              <span className="text-[#0F6EFB]">UOSLIFE</span>에 궁금한 점이나
              <br />
              의견이 있다면?
            </p>

            <div className="flex items-center gap-2">
              <p className="text-[#54545C] font-['Pretendard'] text-xl font-bold leading-[160%]">
                시대생 카카오톡 채널 바로가기
              </p>
              <div className="flex w-6 h-6 justify-center items-center gap-2.5">
                <Image src="/img/recruit/anglebracket.svg" alt="bracket" width={10} height={20} />
              </div>
            </div>
          </Link>

          {/* 카드 2 */}
          <Link
            href="#"
            className="flex h-[400px] p-12 flex-col justify-between items-start flex-1 rounded-[20px] bg-white/80 shadow-[0_0_16px_0_rgba(70,134,255,0.12)]"
          >
            <p className="self-stretch opacity-95 text-[#222227] font-['Pretendard'] text-[40px] font-bold leading-[140%]">
              <span className="text-[#0F6EFB]">UOSLIFE</span>의 실시간 소식을
              <br />
              알고 싶다면?
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[#54545C] font-['Pretendard'] text-xl font-bold leading-[160%] ">
                시대생 인스타그램 바로가기
              </p>
              <div className="flex w-6 h-6 justify-center items-center gap-2.5">
                <Image src="/img/recruit/anglebracket.svg" alt="bracket" width={10} height={20} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
