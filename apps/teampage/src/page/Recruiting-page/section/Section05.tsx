'use client';
import { useMemo, useState } from 'react';

import {
  buildRecruitingFaqItems,
  recruitingFaqSectionTitle,
  type RecruitingFaqItem,
} from '@/page/Recruiting-page/config';

import { FAQbutton } from './FAQbutton';

function QandAchild({ item, index, total }: { item: RecruitingFaqItem; index: number; total: number }) {
  const initS = index === 0 ? true : false;
  const [open, setOpen] = useState(initS);
  return (
    <div key={index} className="flex flex-col items-start gap-5 self-stretch max-md:gap-4 ">
      <FAQbutton question={item.question} open={open} setOpen={setOpen} />
      {open && (
        <div className="flex flex-col w-[1063px]  gap-5 items-start max-md:gap-2 max-md:self-stretch max-2xl:w-[100%]">
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
      {index !== total - 1 && (
        <svg className="w-full h-[1px]" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#E1E1E7" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
}

function QandA({ items }: { items: ReadonlyArray<RecruitingFaqItem> }) {
  return (
    <>
      {items.map((item, index) => {
        return <QandAchild key={index} item={item} index={index} total={items.length} />;
      })}
    </>
  );
}

export function Section05() {
  const faqItems = useMemo(() => buildRecruitingFaqItems(), []);

  return (
    <div className="flex flex-col items-start w-full gap-20 w-full max-md:gap-7 px-[16.66667%] pb-[120px] max-md:pb-[60px] max-md:px-4">
      <h3 className="text-[#222227] font-bold text-[72px] leading-[120%] self-stretch max-md:text-[32px] max-md:leading-[140%]">
        {recruitingFaqSectionTitle}
      </h3>
      <div
        className="flex flex-col items-start gap-7 self-stretch
      max-md:gap-4"
      >
        <QandA items={faqItems} />
      </div>
    </div>
  );
}
