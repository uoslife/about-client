'use client';

import { Text } from '@shared/component/Text';
import Image from 'next/image';
import { TabButton } from '@/shared/component/TabButton';
import { HoverScaleAnimation } from '@/shared/component/animation/HoverScaleAnimation';
import { Divider } from '../../../shared/component/Divider';
import { useHorizontalScroll } from '@/shared/hooks/useHorizontalSrcoll';
import { useSendInViewAmplitudeEvent } from '@/entities/analytics/useSendInViewAmplitudeEvent';
import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

const CATEGORY = ['Alumni', 'Leader', 'Active Member'] as const;
type CategoryType = (typeof CATEGORY)[number];
export function Section08() {
  const { ref } = useSendInViewAmplitudeEvent('SCROLL_HOME', {
    tab_name: 'home',
    scroll_section: '5_interview',
  });

  return (
    <div
      className="relative flex flex-col items-center justify-center bg-black gap-28 py-28"
      ref={ref}
    >
      <Image
        src="/img/section08_bg.webp"
        alt="section 09 background"
        fill
        className="absolute top-0 left-0"
      />
      <div className="z-10 flex flex-col gap-8 w-full max-w-pc">
        <div className="flex flex-col gap-2">
          <Text variant="title-28-m" color="white">
            Interview
          </Text>
          <Text as="h2" variant="heading-72-b" color="white">
            시대생 멤버들이 전하는 경험과 성장
          </Text>
        </div>
        <Text
          variant="title-24-m"
          className="whitespace-pre-line"
          color="grey-100"
        >
          {
            '졸업생, 대표단, 현 활동 멤버까지 —\n시대생을 통해 어떤 배움과 변화를 얻었는지 생생한 경험담을 확인해보세요.'
          }
        </Text>
      </div>
      <InterviewCarousel />
    </div>
  );
}

function InterviewCarousel() {
  const hasSwipeLastItem = useRef(false);
  const {
    category,
    currentIndex,
    scrollRef,
    itemRefs,
    handleTabClick,
    handlePrevClick,
    handleNextClick,
  } = useHorizontalScroll<CategoryType>({ data: INTERVIEW_DATA });
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (currentIndex === INTERVIEW_DATA.length - 1) {
      !hasSwipeLastItem.current &&
        trackEvent('SWIPE_INTERVIEW', {
          tab_name: 'home',
          scroll_section: '5_interview',
        });
      hasSwipeLastItem.current = true;
    }
  }, [currentIndex, trackEvent]);

  return (
    <div className="relative w-full flex flex-col gap-9 items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-3">
        {CATEGORY.map((cat) => (
          <TabButton
            key={cat}
            clicked={category === cat}
            onClick={() => handleTabClick(cat)}
            color="dark"
          >
            {cat}
          </TabButton>
        ))}
      </div>
      <div className="w-[100vw] ml-auto overflow-x-scroll">
        <div
          ref={scrollRef}
          className="flex flex-row gap-9 overflow-x-scroll snap-x snap-mandatory px-[calc(50vw-225px)] no-scrollbar"
        >
          {INTERVIEW_DATA.map((data, index) => (
            <div
              key={data.name}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="snap-center"
            >
              <InterviewCard {...data} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row w-full items-center justify-end gap-3 mr-60">
        <HoverScaleAnimation
          as="button"
          onClick={handlePrevClick}
          className="w-14 h-14 rounded-full bg-grey-800 flex items-center justify-center disabled:opacity-30"
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
          className="w-14 h-14 rounded-full bg-grey-800 flex items-center justify-center disabled:opacity-30"
          disabled={currentIndex === INTERVIEW_DATA.length - 1}
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
      </div>
    </div>
  );
}

function InterviewCard({
  imageUrl,
  name,
  category,
  position,
  description,
}: {
  imageUrl: string;
  name: string;
  category: string;
  position: string;
  description: string;
}) {
  return (
    <div className="p-9 bg-grey-900 rounded-3xl flex flex-col gap-8 w-[420px] h-[450px]">
      <div className="flex flex-row justify-between items-start">
        <Image
          src={imageUrl}
          alt={name}
          width={120}
          height={120}
          className="rounded-full w-[120px] h-[120px] object-cover"
        />
        <div className="rounded-[20px] bg-grey-800 py-2 px-4">
          <Text variant="body-16-m" color="grey-100">
            {category}
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Text variant="body-18-m" color="grey-100">
          {description}
        </Text>
        <Divider />
        <div className="flex flex-row items-center gap-2">
          <Text variant="body-20-b" color="white">
            {name}
          </Text>
          <Text variant="body-20-m" color="grey-400">
            {position}
          </Text>
        </div>
      </div>
    </div>
  );
}

const INTERVIEW_DATA: {
  imageUrl: string;
  category: CategoryType;
  name: string;
  position: string;
  description: string;
}[] = [
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Alumni',
    name: '문정민',
    position: '1기 대표',
    description:
      '시대생 앱을 처음 만들고 배포하던 순간부터 지금 후배들과 이어가는 프로젝트까지 모두 저에겐 소중한 기억으로 남아 있습니다. 앞으로 더 많은 분들이 저희 팀에 조인하시길 기다리겠습니다!',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Alumni',
    name: '김은서',
    position: '2기 대표',
    description:
      '제가 기획한 서비스로 캠퍼스가 떠들썩하던 순간은 대학생활 중 가장 벅찬 기억이었습니다. 시대생은 무모한 도전을 가능하게 한 무대이자, PM이라는 꿈으로 이어진 출발점이 되었습니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Alumni',
    name: '정인우',
    position: '2기 개발',
    description:
      '학생으로써, 하나의 완결된 프로덕트를 개발하고 운영하며, 개선까지 진행하는 것은 쉽게 얻을 수 있는 경험이 아니라고 생각합니다. 시대팅을 처음 개발하여 배포했던 때가 아직도 기억에 남습니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Alumni',
    name: '정승원',
    position: '3기 디자인',
    description:
      '사용자 중심의 사고를 배우며 유틸리티팀과 커뮤니티팀으로 나뉘어 인터뷰와 문제 정의를 진행했던 경험이 인상 깊었습니다. 인터뷰로 본 유저의 반응은 제 자신에게 새로운 자극이었습니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Leader',
    name: '이서현',
    position: '4기 대표',
    description:
      '앱 서비스의 제작부터 팀원간 소통까지, 수많은 고민을 통해 탄생한 서비스인 시대생은 현재 수백명의 학생들에게 사용되고 있습니다. 저에게 시대생은 앱을 넘어 시립대생활의 줄임말이 되었습니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Leader',
    name: '조민지',
    position: '3기 부대표',
    description:
      '가까이 있는 팀원들 간의 연결부터 크게는 서울시립대 전체의 연결을 목표로 한 모든 시대생 활동들은 저에게 새로운 도전이었습니다. 시대생을 통한 도전과 성장의 과정은 잊지 못할 경험입니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Active Member',
    name: '강용현',
    position: '5기 개발',
    description:
      '활동을 하면서 "시립대생만"을 위한 서비스를 만드는 의미있는 경험을 한 것이 가장 기억에 남습니다. "Beyond connect, 시대생을 연결하다"는 말처럼 모두가 연결되는 날을 만들겠습니다.',
  },
  {
    imageUrl: '/svg/roomae_03.svg',
    category: 'Active Member',
    name: '염원경',
    position: '4기 마케팅',
    description:
      '기획부터 운영까지 전 과정을 함께 보며 배웠고, 학생 대상 마케팅으로 실제 유저를 만날 수 있어 좋았습니다. 시대생을 통해 새로운 유저를 만나길 또 기대하고 있습니다.',
  },
];
