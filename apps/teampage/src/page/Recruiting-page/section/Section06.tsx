export async function Section06() {
  return (
    <div className="flex flex-col justify-center items-center w-[120rem] h-[30rem] gap-2.5 flex-shrink-0 bg-gradient-to-b from-blue-500/5 to-white/5">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-center font-bold text-[4.5rem] leading-[120%] bg-gradient-to-r from-black via-blue-600 to-blue-200 bg-clip-text text-transparent">
            UOSLIFE에서 <br />
            여러분을 기다립니다
          </h3>
          <p className="text-center text-[#54545C] text-[1.125rem] font-medium leading-[160%]">
            11/30(일) 오후 11시 59분까지 하단의 링크를 통해 지원서를 제출해
            주세요.
          </p>
        </div>
        <button className="flex justify-center items-center h-[4.25rem] px-10 gap-2.5 rounded-xl bg-[#222227]">
          <span className="text-white text-2xl font-bold leading-[150%]">
            6기 지원하기
          </span>
        </button>
      </div>
    </div>
  );
}
