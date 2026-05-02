'use client';

import { Text } from '@/shared/component/Text';
import { recruitingAssets, recruitingBrand, recruitingPeriod } from '@/page/Recruiting-page/config';

export function Section01() {
  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
}

const DesktopView = () => {
  return (
    <div
      className="hidden md:flex justify-center items-center bg-center bg-no-repeat bg-cover min-h-screen"
      style={{ backgroundImage: `url('${recruitingAssets.heroLogoBackground}')` }}
    >
      <div className="flex flex-col w-[1280px] gap-8 text-left">
        <p className="w-fit text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">{recruitingBrand.name}</p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 text-[18px] font-medium text-[#222227] justify-end">
            <div className="flex items-center gap-3">
              <p>{recruitingPeriod.rangeStartLabel}</p>
              <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
            </div>
            <p>{recruitingPeriod.rangeEndLabel}</p>
          </div>
          <p className="w-fit text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">{recruitingBrand.cohortLabel}</p>
        </div>
      </div>
    </div>
  );
};

const MobileView = () => {
  return (
    <div className="flex md:hidden flex-col gap-7">
      <div
        className="flex pt-8 justify-center items-center bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${recruitingAssets.heroLogoBackground}')` }}
      >
        <div className="flex flex-col items-center">
          <Text variant="heading-80-b" color="grey-900">
            {recruitingBrand.name}
          </Text>
          <Text variant="heading-80-b" color="grey-900">
            {recruitingBrand.cohortLabel}
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Text variant="title-18-b" color="grey-900">
          {recruitingPeriod.rangeStartLabel}
        </Text>
        <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
        <Text variant="title-18-b" color="grey-900">
          {recruitingPeriod.rangeEndLabel}
        </Text>
      </div>
    </div>
  );
};
