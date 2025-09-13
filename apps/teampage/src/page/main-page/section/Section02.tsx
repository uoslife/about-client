import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function Section02() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-black gap-28 py-28">
      <Image
        src="/img/section02_bg.webp"
        alt="section 02 background"
        fill
        className="absolute top-0 left-0"
      />
      <div className="z-10 flex flex-col items-center text-center gap-4">
        <Text as="h2" variant="title-40-b" color="white">
          Our Values
        </Text>
        <Text
          variant="title-28-b"
          className="whitespace-pre-line text-5xl text-center"
          color="white"
        >
          {
            '시대생 팀은 모든 시립대 구성원을 연결하는 중심축으로서\n새로운 영향력을 일으키고자 합니다.'
          }
        </Text>
      </div>
      <div className="z-10 flex flex-col items-center gap-20">
        <div className="grid grid-cols-2 w-full gap-6">
          {STORY_BOX_DATA.map((data) => (
            <OurValueBox
              key={data.title}
              title={data.title}
              imagePath={data.imagePath}
              content={data.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const STORY_BOX_DATA = [
  {
    title: '연결',
    imagePath: '/img/section02_value_01.webp',
    content: '2020~',
  },
  {
    title: '혁신',
    imagePath: '/img/section02_value_02.webp',
    content: '100+',
  },
  {
    title: '성장',
    imagePath: '/img/section02_value_03.webp',
    content: '25+',
  },
  {
    title: '공감',
    imagePath: '/img/section02_value_04.webp',
    content: '25+',
  },
];

function OurValueBox({
  title,
  imagePath,
}: {
  title: string;
  imagePath: string;
  content: string;
}) {
  return (
    <div className="relative flex flex-col items-start justify-start gap-1 p-8 w-[540px] h-[360px] rounded-[40px]">
      <Image
        src={imagePath}
        alt={''}
        fill
        className="absolute top-0 left-0 -z-10 rounded-[40px]"
      />
      <Text variant="title-40-b" color="white">
        {title}
      </Text>
      <Image src="/svg/add.svg" alt="add icon" width={44} height={44} />
    </div>
  );
}
