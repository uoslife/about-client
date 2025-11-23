import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type People = {
  company: string;
  name: string;
  role: string;
  src: string;
};

const People = [
  {
    company: '네이버',
    name: '정인우',
    role: 'Back-end Engineer',
    src: '/img/recruit/mentor1.svg',
  },
  {
    company: '카카오페이',
    name: '김나연',
    role: 'Back-end Engineer',
    src: '/img/recruit/mentor2.svg',
  },
  {
    company: '미리디',
    name: '조종빈',
    role: 'Front-end Engineer',
    src: '/img/recruit/mentor3.svg',
  },
  {
    company: 'SKT',
    name: '배서현',
    role: 'Infra Engineer',
    src: '/img/recruit/mentor4.svg',
  },
  {
    company: '리멤버',
    name: '김은서',
    role: 'Product Manager',
    src: '/img/recruit/mentor5.svg',
  },
  {
    company: 'PwC컨설팅',
    name: '문정민',
    role: 'Consultant',
    src: '/img/recruit/mentor6.svg',
  },
  {
    company: '그릿스탠다드',
    name: '정희윤',
    role: 'UXUI Designer',
    src: '/img/recruit/mentor7.svg',
  },
  {
    company: '에코마케팅',
    name: '우채윤',
    role: 'Marketer',
    src: '/img/recruit/mentor8.svg',
  },
] as const satisfies People[];

export function Section02() {
  return (
    <>
      <div
        className={twMerge(
          'flex items-start w-[100%] flex-row gap-[13.25rem] pb-60 px-80 pt-[100px] max-lg:flex-col max-lg:px-[16px] max-lg:gap-7 max-lg:w-[100%] max-lg:justify-center max-lg:pt-[80px] max-lg:pb-[120px]',
        )}
      >
        <div className="flex flex-col items-start gap-5">
          <h2
            className="whitespace-nowrap font-['Pretendard'] text-[48px] font-bold leading-[140%] self-stretch bg-gradient-to-r from-black via-[#0F6EFB] to-[#AACEFF] bg-clip-text text-transparent 
          max-md:text-[24px] max-md:leading-[150%]"
          >
            Team UOSLIFE
          </h2>
          <Link href="/" className="flex p-1 items-center gap-1">
            시대생 자세히 알아보기
            <div className="text-[#54545C] font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]">
              <Image src="/img/recruit/anglebracket.svg" alt="bracket" width={8} height={8} />
            </div>
          </Link>
        </div>
        <div className="text-[#303037] font-['Pretendard'] text-xl font-medium leading-[160%] gap-5 flex flex-col">
          <p className="text-[#303037] font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]">
            UOSLIFE(시대생)는 서울시립대학교 학우들에게 편리하고 즐거운 학교생활을 위한 서비스를 만들어가는 IT
            소프트웨어 동아리입니다. 시대생 앱을 운영하며 시간표, 공지사항, 시대팅 등 대학 생활을 위한 다양한 서비스를
            제공하고 있습니다.
          </p>
          <p className="text-[#303037] font-['Pretendard'] text-xl font-medium leading-[160%] max-md:text-[14px]">
            2026년에는 대학 생활의 본질적 가치를 확장하는 새로운 기능과 경험을 선보이며, 학우들의 일상 속에 더욱 깊이
            스며드는 플랫폼으로 성장할 것입니다. 아울러 구성원들이 자율적으로 협업하고 함께 배우는 문화를 바탕으로,
            캠퍼스 내에서 지속 가능한 IT 생태계를 만들어 나가고자 합니다.
          </p>
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
            Synergize <br className="md:hidden" />
            with Alumni
          </h2>
          <div className="w-2/3 max-md:w-[100%]">
            <p className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] self-stretch max-md:text-[14px]">
              샌프란시스코 실리콘밸리의 성공 배경에는, Pay it forward라 불리는 IT 업계 선후배 사이의 멘토 문화가
              핵심으로 자리 잡고 있습니다.
            </p>
            <p className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] self-stretch max-md:text-[14px]">
              그리고 UOSLIFE는 업계 다방면에서 활동하는 선배들과 직접 소통하며 성장할 수 있는 곳입니다.
            </p>
            <p className="text-[#303037] text-center font-['Pretendard'] text-xl font-medium leading-[160%] self-stretch max-md:text-[14px]">
              &apos;UOSLIFE&apos;는 5년 전 시작한 시대생 앱을 시작으로 선후배가 함께 어우러져 다양한 IT 서비스를
              운영하고 있습니다.
            </p>
          </div>
        </div>

        <div className="flex w-2/3 flex-col items-center gap-[60px]  md:mx-auto pb-40 max-md:gap-[24px] max-md:px-[16px] max-md:w-[100%] max-md:pb-[60px]">
          <h2
            className="text-[40px] text-center leading-[140%] font-bold text-[#222227] max-md:leading-[160%] max-md:text-[20px]
        max-md:leading-[160%]"
          >
            6기와 활동을 함께할 멘토
          </h2>
          <div className="grid w-full grid-cols-2 gap-[20px] lg:grid-cols-4">
            {People.map((person, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center rounded-2xl bg-white py-6 px-9 shadow-md justify-center items-center gap-7 rounded-[20px] border-[1.5px] border-white bg-white shadow-[0_0_16px_0_rgba(70,134,255,0.12)] max-md:py-[12px] max-md:px-[24px] max-md:gap-[12px]"
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
