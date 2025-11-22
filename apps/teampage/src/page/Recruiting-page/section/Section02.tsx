import { Text } from '@/shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

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
      <section className="w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-12 lg:flex-row lg:items-center lg:gap-24">
          <div className="flex flex-col gap-4 text-left lg:min-w-[360px]">
            <h2 className="text-[42px] font-bold text-[#222227]">
              Team{' '}
              <span className="bg-gradient-to-r from-[#0F6EFB] to-[#6AB5FF] bg-clip-text text-transparent">
                UOSLIFE
              </span>
            </h2>
            <Link
              href="/"
              className="flex items-center gap-2 text-[18px] font-semibold text-[#222227] transition-colors hover:text-[#0F6EFB]"
            >
              시대생 자세히 알아보기
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-6 text-[18px] leading-[1.8] text-[#222227] lg:max-w-[600px]">
            <p>
              UOSLIFE(시대생)는 서울시립대학교 학우들에게 편리하고 즐거운 학교생활을 위한 서비스를 만들어가는 IT
              소프트웨어 동아리입니다. 시대생 앱을 운영하며 시간표, 공지사항, 시대팅 등 대학 생활을 위한 다양한 서비스를
              제공하고 있습니다.
            </p>
            <p>
              2026년에는 대학 생활의 본질적 가치를 확장하는 새로운 기능과 경험을 선보이며, 학우들의 일상 속에 더욱 깊이
              스며드는 플랫폼으로 성장할 것입니다. 아울러 구성원들이 자율적으로 협업하고 함께 배우는 문화를 바탕으로,
              캠퍼스 내에서 지속 가능한 IT 생태계를 만들어 나가고자 합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-8 text-center">
          <h2 className="text-[48px] font-bold text-[#222227]">Synergize with Alumni</h2>
          <div className="flex flex-col gap-1 text-[18px] leading-[1.8] text-[#222227]">
            <p>
              샌프란시스코 실리콘밸리의 성공 배경에는, Pay it forward라 불리는 IT 업계 선후배 사이의 멘토 문화가
              핵심으로 자리 잡고 있습니다.
            </p>
            <p>그리고 UOSLIFE는 업계 다방면에서 활동하는 선배들과 직접 소통하며 성장할 수 있는 곳입니다.</p>
            <p>
              &apos;UOSLIFE&apos;는 5년 전 시작한 시대생 앱을 시작으로 선후배가 함께 어우러져 다양한 IT 서비스를
              운영하고 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-3">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-16">
          <h2 className="text-[36px] font-bold text-[#222227]">멘토 소개</h2>
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {People.map((person, idx) => (
              <div key={idx} className="flex flex-col items-center rounded-2xl bg-white px-6 py-3 shadow-md">
                <Image
                  src={person.src}
                  alt={`${person.name} 멘토`}
                  width={140}
                  height={140}
                  className="mb-8 rounded-full"
                />
                <div className="flex flex-col items-center gap-2">
                  <Text
                    variant={{ initial: 'body-14-b', lg: 'body-20-b' }}
                    color="grey-900"
                    className="whitespace-nowrap"
                  >
                    {person.company}
                  </Text>
                  <Text
                    variant={{ initial: 'body-14-m', lg: 'body-16-m' }}
                    color="grey-700"
                    className="whitespace-nowrap"
                  >
                    {person.role}
                  </Text>
                  <Text variant={{ initial: 'body-14-b', lg: 'body-16-b' }} color="grey-900">
                    {person.name}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
