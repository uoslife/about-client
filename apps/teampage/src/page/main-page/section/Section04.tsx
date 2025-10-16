'use client';
import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function Section04() {
  return (
    <div className="flex flex-col items-center justify-center gap-[180px] my-40 max-md:my-7 max-md:p-[18px] max-md:gap-7">
      <Text as="h2" variant="heading-100-b" color="primary-gradiant" className='max-md:text-heading-48-b'>
        Challenge & Immersion
      </Text>
      <div className="flex flex-col items-start gap-14 max-w-pc w-full">
        <Text variant="heading-80-b" className="whitespace-pre-line max-md:text-heading-28-b">
          {`대학생활에서 만나는\n가장 깊은 몰입 —`}
        </Text>
        <Image
          src="/img/section04_bg.webp"
          alt="section04 background"
          height={1440}
          width={720}
          className="rounded-[60px] w-full max-md:h-[328px] max-md:w-[328px] max-md:rounded-[20px] max-md:object-cover max-md:object-center"
        />
        <Text variant="title-28-b" color="grey-600" className='max-md:text-title-18-b'>
          <span>시대생은 단순한 동아리 활동을 넘어, </span>
          <br />
          <span>인생에서 </span>
          <span className="text-grey-900">
            가장 치열하게 몰입할 수 있는 경험
          </span>
          <span>을 선물합니다.</span>
          <br />
          <span>
            아이디어를 현실로 만들고, 기술과 지식을 함께 배우는 과정 속에서
          </span>
          <br />
          <span className="text-gray-800">
            대학 시절 가장 밀도있게 성장하는 순간
          </span>
          <span>을 만들어갑니다.</span>
        </Text>
      </div>
    </div>
  );
}
