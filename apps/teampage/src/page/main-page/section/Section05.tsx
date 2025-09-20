'use client';

import { TabButton } from '@shared/component/TabButton';
import { Text } from '@shared/component/Text';
import Image from 'next/image';
import { HoverScaleAnimation } from '@/shared/component/animation/HoverScaleAnimation';
import { useHorizontalScroll } from '@/shared/hooks/useHorizontalSrcoll';

const CATEGORY = ['Education', 'Production', 'Networking'] as const;
type CategoryType = (typeof CATEGORY)[number];

export function Section05() {
  const {
    category,
    currentIndex,
    scrollRef,
    itemRefs,
    handleTabClick,
    handlePrevClick,
    handleNextClick,
  } = useHorizontalScroll<CategoryType>({ data: CURRICULUM_DATA });

  return (
    <div className="flex flex-col items-center justify-center gap-28 py-28">
      <div className="z-10 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col gap-2">
          <Text as="h2" variant="title-28-m" color="primary-ui">
            Curriculum
          </Text>
          <Text as="h2" variant="title-40-b" className="whitespace-pre-line">
            {`정기 커리큘럼으로 함께 배우고 성장해요. 매 기수마다\n다양한 활동 속에서 IT 역량과 팀워크를 쌓을 수 있습니다.`}
          </Text>
        </div>
      </div>
      <div className="relative w-full flex flex-col gap-9 items-center justify-center">
        <div className="flex flex-row items-center justify-center gap-3">
          {CATEGORY.map((cat) => (
            <TabButton
              key={cat}
              clicked={category === cat}
              onClick={() => handleTabClick(cat)}
            >
              {cat}
            </TabButton>
          ))}
        </div>
        <div className="w-[100vw] ml-auto overflow-x-scroll">
          <div
            ref={scrollRef}
            className="flex flex-row gap-9 overflow-x-scroll snap-x snap-mandatory px-[calc(50vw-270px)] no-scrollbar"
          >
            {CURRICULUM_DATA.map((data, index) => (
              <div
                key={data.title}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="snap-center"
              >
                <CurriculumCard {...data} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-end gap-3 mr-60">
          <HoverScaleAnimation
            as="button"
            onClick={handlePrevClick}
            className="w-14 h-14 rounded-full bg-grey-50 flex items-center justify-center disabled:opacity-30"
            disabled={currentIndex === 0}
          >
            {() => (
              <Image
                src="/svg/arrow-left.svg"
                alt="이전"
                width={24}
                height={24}
              />
            )}
          </HoverScaleAnimation>

          <HoverScaleAnimation
            as="button"
            onClick={handleNextClick}
            className="w-14 h-14 rounded-full bg-grey-50 flex items-center justify-center disabled:opacity-30"
            disabled={currentIndex === CURRICULUM_DATA.length - 1}
          >
            {() => (
              <Image
                src="/svg/arrow-right.svg"
                alt="다음"
                width={24}
                height={24}
              />
            )}
          </HoverScaleAnimation>
          <button></button>
        </div>
      </div>
    </div>
  );
}

function CurriculumCard({
  imageUrl,
  title,
  description,
}: {
  imageUrl: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-9 w-[540px] flex-shrink-0">
      <div className="relative w-[540px] h-[405px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          placeholder="blur"
          unoptimized
          blurDataURL={imageUrl}
          className="rounded-[36px] object-cover"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Text variant="title-28-b">{title}</Text>
        <Text variant="body-18-m" color="grey-700">
          {description}
        </Text>
      </div>
    </div>
  );
}

const CURRICULUM_DATA: {
  imageUrl: string;
  category: CategoryType;
  title: string;
  description: string;
}[] = [
  {
    imageUrl: '/img/section05_curriculum01.webp',
    category: 'Education',
    title: '시대세미나',
    description:
      '시대세미나는 동아리 출신 현직 선배들이 진행하는 취업 및 역량 강화 특강으로, 실무 경험과 노하우를 직접 배우며 진로 준비에 필요한 인사이트를 얻을 수 있는 프로그램입니다.',
  },
  {
    imageUrl: '/img/section05_curriculum02.webp',
    category: 'Education',
    title: '챕터스터디',
    description:
      '챕터스터디는 기획, 개발, 디자인 각 챕터별로 운영되는 자율 학습 프로그램으로, 챕터원들이 함께 다양한 주제를 탐구하며 실력을 심도 있게 다져갈 수 있습니다.',
  },
  {
    imageUrl: '/img/section05_curriculum03.webp',
    category: 'Production',
    title: '프로덕트 개발 및 운영',
    description:
      '유저 리서치를 바탕으로 학생들의 니즈를 반영해 새로운 서비스를 기획·개발하고, 이를 안정적으로 운영하며 지속적으로 개선합니다.',
  },
  {
    imageUrl: '/img/section05_curriculum04.webp',
    category: 'Networking',
    title: '시대 멘토링',
    description:
      '시대 멘토링은 선배 기수와 현재 활동 기수가 함께 모여 교류하는 자리로, 서로의 경험을 나누고 유대감을 쌓으며 시대생 공동체의 연결을 이어가는 활동입니다.',
  },
  {
    imageUrl: '/img/section05_curriculum05.webp',
    category: 'Networking',
    title: '시대생의 밤',
    description:
      '시대생의 밤은 연례적으로 열리는 행사로, 선배 기수를 초청하여 그동안의 활동을 돌아보고 함께 추억을 나누며 기수 간 교류와 유대감을 이어가는 자리입니다.',
  },
];
