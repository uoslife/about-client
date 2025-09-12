'use client';

import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';
import { TECH_CONTENT_MOCK } from '@/page/tech-page/TechMainSection';
import { Card } from '@/shared/component/card';

export function Section07() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 my-40">
      <div className="flex flex-col items-center text-center gap-9">
        <div className="gap-4">
          <Text variant="title-24-b" color="primary-ui">
            Insights & Tech
          </Text>
          <Text variant="heading-72-b">시대생이 함께 쌓아가는 기술 이야기</Text>
        </div>
        <Text variant="title-24-m" color="grey-700">
          PM · 개발 · 디자인 · 마케팅 각 챕터의 시선에서 풀어낸 실제 프로젝트
          경험과 기술 인사이트를 만나보세요.
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {TECH_CONTENT_MOCK.map((data) => (
          <Card.A link={'/tech/0'} key={data.title} content={data} />
        ))}
      </div>
      <Link
        href="/tech"
        className="flex flex-row gap-3 pl-4 pr-4 py-2 rounded-xl bg-primary-lighter-alt"
      >
        <Text variant="body-20-m" color="primary-ui">
          전체 보러 가기
        </Text>
        <Image
          src="/svg/arrow-right-primary-ui.svg"
          alt="arrow icon"
          height={14}
          width={8}
        />
      </Link>
    </div>
  );
}
