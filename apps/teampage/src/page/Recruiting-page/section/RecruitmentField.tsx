'use client';

import React from 'react';
import { useState } from 'react';
import { RecruitmentFieldButton } from './RecruitmentFieldButton';

const Detail = ({ item }) => {
  return (
    <>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <h6 className="text-[#222227] text-xl font-bold leading-[160%] max-md:text-sm">하는 일</h6>
        <ul className="self-stretch text-[#303037] text-lg font-medium leading-[160%] list-disc pl-5 space-y-2 [&>li]:pl-2 max-md:text-sm">
          {item.do.map((task, taskIndex) => (
            <li key={taskIndex}>{task}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <h6 className="text-[#222227] text-xl font-bold leading-[160%] max-md:text-sm">이런 사람과 함께 하고 싶어요</h6>
        <ul
          className="self-stretch text-[#303037] text-lg font-medium leading-[160%] list-disc pl-5 space-y-2 [&>li]:pl-2 
        max-md:text-sm"
        >
          {item.with.map((requirement, reqIndex) => {
            if (React.isValidElement(requirement)) {
              return (
                <li key={reqIndex} className="list-none pl-0">
                  {requirement}
                </li>
              );
            }
            return <li key={reqIndex}>{requirement}</li>;
          })}
        </ul>
      </div>
    </>
  );
};
interface SubRole {
  subrole: string;
  do: string[];
  with: (string | React.ReactNode)[];
}

interface textRole {
  role: string;
  type: string;
  do?: string[];
  with?: string[];
  content?: SubRole[];
}

const Section4text: textRole[] = [
  {
    role: '기획자',
    type: 'one',
    do: [
      '기획 챕터는 프로덕트 출시 관련 계획, 일정 수립 등을 조직 차원에서 고민하고 결정해요.',
      '우리가 개선해야 할 문제점은 무엇인지, 사용자에게 필요한 것이 무엇인지 고민하고 그에 맞는 해결 방법을 제시해요.',
    ],
    with: [
      '사용자 관점에서 접근하고, 문제를 해결하기 위해 주도적으로 실행한 경험이 있으신 분',
      '데이터를 수집하고 다각도에서 유저를 분석하는 것에 관심이 있으신 분',
    ],
  },
  {
    role: '디자이너',
    type: 'one',
    do: [
      '디자인 챕터는 사용자가 우리 서비스를 재미있고 편하게 이용할 수 있도록 웹/앱을 설계하고, 직관적인 UI 경험을 만들어갑니다.',
      '기획팀과 협업해 사용자의 불편을 직접 확인하고, 이를 해결할 수 있는 UI 아이디어를 고민하고 빠르게 시도합니다.',
    ],
    with: [
      'Figma 또는 Adobe Illustrator 사용이 가능하신 분',
      '‘내 취향’이 아닌 사용자가 원하는 것을 탐구하고 실험하시는 분',
      '왜 이렇게 디자인했는지에 대한 논리와 근거를 바탕으로 작업하는 분',
      '다양한 웹/앱 사례를 살펴보고 우리 서비스에 가장 적합한 UI를 찾아 적용하시는 분',
    ],
  },
  {
    role: '개발자',
    type: 'two',
    content: [
      {
        subrole: 'Front-End',
        do: [
          '사용자에게 가장 먼저 보이는 화면을 만들고, 더 나은 경험을 설계하는 일을 합니다.',
          'React, TypeScript, Next.js 등 모던 자바스크립트 프레임워크·라이브러리을 통해 서비스를 구현합니다',
          '디자인과 사용자 경험(UX)을 고려한 개발을 통해 ‘보이는 기술’을 만드는 팀입니다.',
        ],
        with: [
          '새로운 기술을 배우는 걸 즐기고, 스스로 성장에 열정이 있는 분',
          '코드뿐 아니라 사용자 경험(UX)에도 관심이 많은 분',
          '완성도 높은 결과물을 위해 세세한 디테일을 놓치지 않는 분',
          '아래 기술 스택에 익숙하신 분',
          <li key="dveloper-width" className="list-disc">
            React (Vite) / Javascript(Typescript)
          </li>,
        ],
      },
      {
        subrole: 'Back-End',
        do: [
          '신규 기능을 설계 → 개발 → 배포까지 end-to-end로 경험해요.',
          '현업 BE 선배들과 코드 리뷰/소통으로 함께 성장해요.',
          '실제 운영 사례를 포트폴리오로 남길 수 있어요.',
        ],
        with: [
          '비 개발자와도 커뮤니케이션이 원활하신 분',
          '디자인 패턴, 아키텍처에 대해 고민해 본 경험이 있으면 좋아요.',
          '아래 기술 스택에 익숙하신 분',
          <li key="subrole-width" className="list-disc">
            Kotlin(or Java) / Spring Boot / RDBMS(예: PostgreSQL, MySQL)
          </li>,
        ],
      },
    ],
  },
  {
    role: '마케터',
    type: 'one',
    do: [
      '마케팅 챕터는 서비스의 가치를 알리고, 서비스의 Growth를 실현하는 역할을 맡고 있어요.',
      'SNS, 팀 페이지의 콘텐츠 기획 및 운영을 통해 서비스 인지도와 브랜드 이미지를 강화해요.',
      'CRM 활동(App Push 등)을 통해 유저의 재방문과 유지율을 높여요.',
    ],
    with: [
      '온∙오프라인 마케팅 방안에 대한 다양한 아이디어와 실행 및 제작 능력이 있으신 분',
      '유저 여정과 지표 분석에 관심이 많거나, 서비스 성장을 고민하고 싶은 분',
    ],
  },
];

export const FnQContent = ({ item, index }: { item: textRole; index: number }) => {
  const initS = index === 0 ? true : false;
  const [isOpen, setIsOpen] = useState(initS);
  return (
    <div
      key={index}
      className={`flex flex-col items-start self-stretch py-7 px-8 ${isOpen ? 'pb-9' : 'pb-7'} gap-2.5 rounded-2xl border border-[#4686FF] bg-white/80 max-md:rounded-xl
            ${isOpen ? 'max-md:pb-6' : 'max-md:pb-4'} max-md:px-4 max-md:pt-4
            `}
    >
      <div
        className="flex flex-col items-start gap-5 self-stretch
            max-md: gap-4"
      >

        <RecruitmentFieldButton name={item.role} open={isOpen} setOpen={setIsOpen} />
        {isOpen && (
          <>
            <hr className="h-px self-stretch bg-[#4686FF]/20" />
            {item.type == 'one' ? (
              <Detail item={item} />
            ) : (
              item.content?.map((subitem, subIndex) => (
                <div key={subIndex} className="flex flex-col items-start gap-5 self-stretch max-md: gap-2">
                  <h5 className="text-[#222227] text-2xl font-bold leading-[150%]">{subitem.subrole}</h5>
                  <Detail item={subitem}></Detail>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export function RecruitmentField() {
  return (
    <>
      {Section4text.map((item, index) => (
        <FnQContent key={index} item={item} index={index} />
      ))}
    </>
  );
}
