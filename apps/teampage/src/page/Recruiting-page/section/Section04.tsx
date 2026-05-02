'use client';

import { Fragment } from 'react';

import {
  recruitingHeadline,
  recruitingSchedule,
  recruitingSectionTitles,
  recruitingTargetAudience,
  type RecruitingScheduleEntry,
} from '@/page/Recruiting-page/config';

import { RecruitmentField } from './RecruitmentField';

function ScheduleDivider() {
  return (
    <svg className="w-full h-px self-stretch" preserveAspectRatio="none">
      <rect width="100%" height="1" fill="rgba(70, 134, 255, 0.20)" />
    </svg>
  );
}

function ScheduleRow({ entry }: { entry: RecruitingScheduleEntry }) {
  const titleClass =
    'text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]';
  const dateClass =
    'text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm max-2xl:text-base';
  const footnoteClass =
    'text-[#80808B] text-base font-medium leading-[160%] max-md:self-stretch max-md:text-xs max-md:leading-[150%] max-2xl:text-sm';

  if (entry.kind === 'documentSubmission') {
    return (
      <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
        <h5 className={titleClass}>{entry.title}</h5>
        <div className="flex items-start gap-3 pt-0.5 max-md:gap-2">
          <div className="flex items-center gap-3 max-md:gap-2">
            <p className={dateClass}>{entry.openDate}</p>
            <div className="w-10 h-0.5 bg-[#222227] max-md:h-px" />
          </div>
          <div className="flex flex-col items-start gap-0.5 max-md:w-[7.2rem]">
            <p className={dateClass}>{entry.dueDate}</p>
            <p className={dateClass}>{entry.dueTimeNote}</p>
          </div>
        </div>
      </div>
    );
  }

  if (entry.kind === 'singleDay') {
    return (
      <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
        <h5 className={titleClass}>{entry.title}</h5>
        {entry.footnote ? (
          <div className="flex flex-col items-start w-[7.75rem] pt-0.5 gap-4 max-md:w-[4.6875rem] max-md:gap-3">
            <p className={dateClass}>{entry.date}</p>
            <p className={`${footnoteClass} max-md:text-xs max-md:leading-[150%]`}>{entry.footnote}</p>
          </div>
        ) : (
          <p className={`${dateClass} max-md:self-stretch`}>{entry.date}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
      <h5 className={titleClass}>{entry.title}</h5>
      <div className="flex flex-col items-start pt-0.5 gap-4 max-md:gap-3">
        <div className="flex items-center gap-3 self-stretch max-md:gap-2">
          <p className={dateClass}>{entry.startDate}</p>
          <div className="w-10 h-0.5 bg-[#222227] max-md:h-px" />
          <p className={dateClass}>{entry.endDate}</p>
        </div>
        {entry.footnote ? (
          <p className={`${footnoteClass} max-md:text-xs max-md:leading-[150%]`}>{entry.footnote}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Section04() {
  return (
    <div
      className="flex flex-col items-start self-stretch gap-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(70,134,255,0.07)_80%,rgba(255,255,255,0.07)_100%)] px-44 pt-20 pb-[200px]
    max-lg:gap-[3.75rem] max-lg:w-full max-lg:pt-7 max-lg:px-4 max-lg:pb-[4.5rem]"
    >
      <h3
        className="self-stretch text-[#222227] font-bold text-[4.5rem] leading-[120%]  w-full max-md:text-[2rem] 
      max-md:leading-[140%] max-lg:text-[3rem]"
      >
        {recruitingHeadline.lines.map((line) => (
          <Fragment key={line}>
            {line}
            <br />
          </Fragment>
        ))}
        {recruitingHeadline.lastLinePrefix}
        <br className="md:hidden" />
        {recruitingHeadline.lastLineSuffix}
      </h3>
      <div className="flex flex-col items-start self-stretch gap-[120px] max-md:gap-11">
        <div
          className="flex w-[54rem] justify-between items-start  max-md:flex-col max-md:gap-4 max-md:self-stretch max-md:w-full
        max-xl:w-[48rem]"
        >
          <h4 className="text-[#222227] font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            {recruitingTargetAudience.sectionTitle}
          </h4>
          <div className="flex pt-1 flex-col items-start gap-5 max-md:gap-3 max-md:self-stretch">
            <div className="flex flex-col items-start gap-1 self-stretch max-md:gap-0.5 max-md:self-stretch">
              <p className="text-grey-900 font-bold text-xl leading-loose not-italic max-md:text-sm max-md:leading-[160%] max-md:self-stretch">
                {recruitingTargetAudience.primaryTitle}
              </p>
              <p className="self-stretch text-grey-700 font-medium text-base leading-[1.6] not-italic max-md:text-xs max-md:leading-[150%]">
                {recruitingTargetAudience.primaryNote}
              </p>
            </div>
            <p className="text-[#222227] font-bold text-xl leading-[160%] self-stretch max-md:text-sm max-md:leading-[160%] max-md:self-stretch">
              {recruitingTargetAudience.durationRequirement}
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between self-stretch max-md:flex-col max-md:gap-1 max-md:self-stretch">
          <h4 className="text-[#222227] font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            {recruitingSectionTitles.fields.line1}
            <br className="hidden md:block" /> {recruitingSectionTitles.fields.line2}
          </h4>
          <div className="flex flex-col items-start w-[52.9375rem] gap-5 max-md:gap-3 max-md:self-stretch max-md:w-full">
            <RecruitmentField />
          </div>
        </div>
        <div className="flex items-start w-full justify-between max-md:flex-col max-md:self-stretch">
          <h4 className="text-[#222227] whitespace-nowrap font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            {recruitingSectionTitles.schedule}
          </h4>
          <div className="flex flex-col items-start w-[73%] gap-10 max-md:items-start max-md:gap-5 max-md:self-stretch">
            {recruitingSchedule.map((entry, index) => (
              <Fragment key={`${entry.kind}-${entry.title}`}>
                <ScheduleRow entry={entry} />
                {index < recruitingSchedule.length - 1 ? <ScheduleDivider /> : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
