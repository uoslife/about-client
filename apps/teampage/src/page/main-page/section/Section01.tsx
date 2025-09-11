import { Text } from '@shared/component/Text';
import { Divider } from '@/shared/component/Divider';

export function Section01() {
  return (
    <div
      id="section01"
      className="scroll-m-40 flex flex-col items-center justify-center gap-20 my-52"
    >
      <div className="flex flex-col items-center text-center gap-6">
        <Text variant="heading-220-b" color="primary-gradiant">
          TEAM UOSLIFE
        </Text>
        <Text
          variant="title-60-b"
          className="whitespace-pre-line text-5xl text-gray-800"
        >
          {'시대생 팀은 IT 기술을 통해\n편리하고 즐거운 학교생활을 만듭니다.'}
        </Text>
      </div>
      <div className="flex flex-col items-center gap-20 max-w-pc w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-4xl font-bold">
            <Text variant="title-40-b" color="primary-ui">
              About Our Story
            </Text>
          </div>
          <div className="text-gray-500 text-xl">
            <Text variant="title-28-b" className="text-grey-600">
              <span>시대생은 </span>
              <span className="text-grey-900">서울시립대학교의 </span>
              <span className="font-bold text-gray-900">중앙 IT동아리</span>
              <span>입니다. 시대생 팀은</span>
              <br />
              <span className="text-gray-800">
                시대생 앱을 포함한 다양한 IT 서비스
              </span>
              <span>를 만들고 운영하고 있습니다.</span>
            </Text>
          </div>
        </div>
        <div className="flex w-full gap-6">
          {STORY_BOX_DATA.map((data) => (
            <OurStoryBox
              key={data.title}
              title={data.title}
              description={data.description}
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
    title: 'Since',
    description: '시작 연도',
    content: '2020~',
  },
  {
    title: 'Alumni',
    description: '졸업 기수',
    content: '100+',
  },
  {
    title: 'Active Members',
    description: '활동 멤버',
    content: '25+',
  },
];

function OurStoryBox({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-5 h-[300px] bg-gray-100 rounded-3xl">
      <div className="flex flex-col items-center text-center">
        <Text variant="title-28-b" color="grey-700">
          {title}
        </Text>
        <Text variant="body-18-m" color="grey-600">
          {description}
        </Text>
      </div>
      <Divider />
      <Text variant="heading-80-b" color="primary-gradiant">
        {content}
      </Text>
    </div>
  );
}
