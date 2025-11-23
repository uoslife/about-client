'use client';
import { useState } from 'react';
import { FAQbutton } from './FAQbutton';

const Section5text: Array<{
  question: string;
  answer: string[];
}> = [
  {
    question: 'Q. 시대생 앱은 어떻게 생겨 났나요?',
    answer: [
      '2020년 5월, 코로나19로 인한 서울시립대학교의 동문 단절로 인한 문제를 해결하고자 학부생 4명이 모여 시작했습니다.',
      '비대면 수업 지원, 코로나 학번의 소통 단절, 동문 연결의 부재 등 서울시립대 내의 연결이 필요한 모든 영역을 IT 기술을 통해 해결하고 혁신하고자 했고, 그 결과 서울시립대의 대표 IT 프로덕트 시대생과 UOSLIFE 동아리가 탄생했습니다.',
      'UOSLIFE는 IT 업계를 희망하는 재학생부터, 현직 주니어로 있는 졸업생들까지 서로의 고민을 공유하고 도우며 이제는 교내를 넘어 국내 IT 업계 최고의 엘리트 공동체로 성장하고자 하는 비전을 갖고 있습니다.',
    ],
  },
  {
    question: 'Q. 정기 모임은 언제, 어디서 하나요?',
    answer: [
      'UOSLIFE는 격주 목요일 저녁 7시 30분에 정기 팀 회의를 진행하고 있습니다. 팀 회의는 각 TF의 활동 공유&친목 도모를 위해 진행되며 가벼운 뒤풀이가 있을 수 있습니다.',
      '매 방학 시즌에는 신규 기능 개발 프로젝트를 진행하며, 이 경우 격주 토요일에 전일(10AM.-10PM.)으로 모여 코어 타임을 갖고 있습니다. 이번 겨울 프로젝트는 1/3(토)를 기점으로 진행될 예정입니다.',
      '*모든 모임은 오프라인 대면으로 진행되고 있으며 프로젝트 상황에 따라 달라질 수 있습니다.',
    ],
  },
  {
    question: 'Q. 졸업생도 지원이 가능한가요?',
    answer: [
      '1년간 꾸준히 활동할 수 있고 배우고자 하는 열의가 충분하다면, 누구든 지원이 가능합니다. 현재도 재학생, 휴학생, 졸업생 중 활발히 활동하시는 분들이 계십니다.',
      '하지만, 매월 둘째 주, 넷째 주에 진행하는 정기 회의 (목요일 7시 30분)와 방학 기간 동안의 *프로젝트 코어 타임은 반드시 참여해야 한다는 점은 꼭 숙지해 주세요!',
      '*프로젝트 코어 타임: 1월 3일부터 격주 토요일 전일',
    ],
  },
  {
    question: 'Q. 실력이 뛰어난 사람만 지원할 수 있나요?',
    answer: [
      'UOSLIFE에서는 1년간 꾸준히 활동할 수 있는지, 그리고 성장하고자 하는 의지가 충분한지를 가장 중요하게 생각합니다.',
      '그러나 교육보다는 프로젝트 진행 중심이기에 내부 현직 특강, 기초 교육 외에는 별도의 체계적인 교육 커리큘럼을 진행하고 있지 않습니다. 따라서, 동아리 활동 외에도 개인적인 노력이 함께 되어야 함을 알아주시길 바랍니다.',
    ],
  },
  {
    question: 'Q. UOSLIFE Alummi (졸업생 및 동문)도 함께 활동하나요?',
    answer: [
      '네, 함께 활동합니다. 학기에 따라 다르지만 UOSLIFE 동아리를 졸업한 Alumni들도 지속적으로 활동하고 있습니다.',
      '방학 프로젝트 및 현직자 특강 등을 통해 재학생들의 성장을 지원하고, 내부 네트워킹 및 현직자 모임을 통해 지속적으로 교류하고 있습니다.',
    ],
  },
];

const QandAchild = ({ item, index }) => {
  const initS = index === 0 ? true : false;
  const [open, setOpen] = useState(initS);
  return (
    <div key={index} className="flex flex-col items-start gap-5 self-stretch max-md:gap-4 ">
      <FAQbutton question={item.question} open={open} setOpen={setOpen} />
      {open && (
        <div className="flex flex-col items-start w-[1063px]  gap-5 items-start max-md:gap-2 max-md:self-stretch max-2xl:w-[100%]">
          {item.answer.map((answeritem, answerIndex) => (
            <p
              key={answerIndex}
              className={`font-medium leading-[160%] self-stretch text-xl ${answeritem.startsWith('*') ? 'text-[#80808B]' : 'text-[#303037]'}
                    max-md:text-sm`}
            >
              {answeritem}
            </p>
          ))}
        </div>
      )}
      {index !== Section5text.length - 1 && (
        <svg className="w-full h-[1px]" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#E1E1E7" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
};

const QandA = () => {
  return (
    <>
      {Section5text.map((item, index) => {
        return <QandAchild key={index} item={item} index={index} />;
      })}
    </>
  );
};

export function Section05() {
  return (
    <div className="flex flex-col items-start w-full gap-20 w-full max-md:gap-7 px-[16.66667%] pb-[120px] max-md:pb-[60px] max-md:px-4">
      <h3 className="text-[#222227] font-bold text-[72px] leading-[120%] self-stretch max-md:text-[32px] max-md:leading-[140%]">
        자주 묻는 질문
      </h3>
      <div
        className="flex flex-col items-start gap-7 self-stretch
      max-md:gap-4"
      >
        <QandA />
      </div>
    </div>
  );
}
