'use client';

import { useState } from 'react';

import {
  recruitingFieldDetailLabels,
  recruitingRoles,
  type RecruitingFieldRole,
  type RecruitingFieldSubRole,
  type RecruitingFieldWithItem,
} from '@/page/Recruiting-page/config';

import { RecruitmentFieldButton } from './RecruitmentFieldButton';

function Detail({
  item,
}: {
  item: {
    readonly do: readonly string[];
    readonly with: readonly RecruitingFieldWithItem[];
  };
}) {
  const labels = recruitingFieldDetailLabels;
  return (
    <>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <h6 className="text-[#222227] text-xl font-bold leading-[160%] max-md:text-sm">{labels.responsibilitiesHeading}</h6>
        <ul className="self-stretch text-[#303037] text-lg font-medium leading-[160%] list-disc pl-5 space-y-2 [&>li]:pl-2 max-md:text-sm">
          {item.do.map((task, taskIndex) => (
            <li key={taskIndex}>{task}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <h6 className="text-[#222227] text-xl font-bold leading-[160%] max-md:text-sm">{labels.partnerHeading}</h6>
        <ul className="self-stretch text-[#303037] text-lg font-medium leading-[160%] list-disc pl-5 space-y-2 [&>li]:pl-2 max-md:text-sm">
          {item.with.map((requirement, reqIndex) => {
            if (typeof requirement === 'string') {
              return <li key={reqIndex}>{requirement}</li>;
            }
            return (
              <li key={reqIndex} className="list-disc">
                {requirement.text}
              </li>
            );
          })}
        </ul>
      </div>
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
                  <h5 className="text-[#222227] text-2xl font-bold leading-[150%]">{subitem.subrole}</h5>
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
