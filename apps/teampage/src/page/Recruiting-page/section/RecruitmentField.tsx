'use client';

import { useState } from 'react';

import {
  recruitingFieldDetailLabels,
  recruitingRoles,
  type RecruitingFieldDetail,
  type RecruitingFieldRole,
  type RecruitingFieldSubRole,
} from '@/page/Recruiting-page/config';

import { RecruitmentFieldButton } from './RecruitmentFieldButton';

const detailBlockKeys = ['do', 'with', 'recommend'] as const;

function Detail({ item }: { item: RecruitingFieldDetail }) {
  return (
    <>
      {detailBlockKeys.map((key) => {
        const label = recruitingFieldDetailLabels[key];
        const block = item[key];
        return (
          <div key={key} className="flex flex-col items-start gap-4 self-stretch max-md:gap-3">
            <div className="flex flex-wrap items-center gap-3 max-md:gap-2">
              <h6 className="text-blue-600 text-xl font-bold leading-[160%] max-md:text-sm">
                <span aria-hidden>{label.emoji}</span> {label.heading}
              </h6>
              <span className="rounded-full bg-[#1A8CFF] px-3 py-0.5 text-sm font-bold leading-[160%] text-white max-md:px-2.5 max-md:text-xs">
                {block.tag}
              </span>
            </div>
            <ul className="self-stretch text-[#303037] text-lg font-medium leading-[160%] list-disc pl-5 space-y-2 [&>li]:pl-2 break-keep max-md:text-sm">
              {block.items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export const FnQContent = ({ item, index }: { item: RecruitingFieldRole; index: number }) => {
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
              item.content?.map((subitem: RecruitingFieldSubRole, subIndex: number) => (
                <div key={subIndex} className="flex flex-col items-start gap-5 self-stretch max-md: gap-2">
                  <h5 className="text-[#222227] text-2xl font-bold leading-[150%] max-md:text-lg">{subitem.subrole}</h5>
                  <Detail item={subitem} />
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
      {recruitingRoles.map((item, index) => (
        <FnQContent key={index} item={item} index={index} />
      ))}
    </>
  );
}
