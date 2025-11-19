'use client';

import { RecruitmentField } from './RecruitmentField';

export function Section04() {
  return (
    <div
      className="flex flex-col items-start self-stretch pt-20 gap-40 px-[20%] pb-50 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(70,134,255,0.07)_80%,rgba(255,255,255,0.07)_100%)]
    max-lg:gap-[3.75rem] max-lg:w-full max-lg:pt-7 max-lg:px-4 max-lg:pb-[4.5rem]"
    >
      <h3 className="self-stretch text-[#222227] font-bold text-[4.5rem] leading-[120%]  w-full max-md:text-[2rem] max-md:leading-[140%]">
        IT 기술을 통해 <br />
        서울시립대학교 구성원을 <br />
        연결하는 프로덕트를 <br />
        만들어갈 인재를 모집합니다.
      </h3>
      <div className="flex flex-col items-start self-stretch gap-[120px] max-md:gap-11">
        <div className="flex w-[54rem] justify-between items-start  max-md:flex-col max-md:gap-4 max-md:self-stretch max-md:w-full">
          <h4 className="text-[#222227] font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            모집 대상
          </h4>
          <div className="flex pt-1 flex-col items-start gap-5 max-md:gap-3 max-md:self-stretch">
            <div className="flex flex-col items-start gap-1 self-stretch max-md:gap-0.5 max-md:self-stretch">
              <p className="text-grey-900 font-bold text-xl leading-loose not-italic max-md:text-sm max-md:leading-[160%] max-md:self-stretch">
                IT 서비스에 관심 있는 서울시립대학교 재학생 및 졸업생
              </p>
              <p className="self-stretch text-grey-700 font-medium text-base leading-[1.6] not-italic max-md:text-xs max-md:leading-[150%]">
                졸업생의 경우, 졸업 후 0~2년 재직자에 한함
              </p>
            </div>
            <p className="text-[#222227] font-bold text-xl leading-[160%] self-stretch max-md:text-sm max-md:leading-[160%] max-md:self-stretch">
              최소 1년(2학기) 이상 활동할 수 있는 사람
            </p>
          </div>
        </div>
        <div className="flex items-start gap-[15.0625rem] self-stretch max-md:flex-col max-md:gap-4 max-md:self-stretch">
          <h4 className="text-[#222227] font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            모집 분야 및 <br /> 우대 사항
          </h4>
          <div className="flex flex-col items-start w-[52.9375rem] gap-5 max-md:gap-3 max-md:self-stretch max-md:w-full">
            <RecruitmentField />
          </div>
        </div>
        <div className="flex items-start gap-[17.8125rem] max-md:flex-col max-md:gap-4 max-md:self-stretch">
          <h4 className="text-[#222227] font-bold text-[2.5rem] leading-[140%] max-md:self-stretch max-md:text-xl max-md:leading-[160%]">
            모집 일정
          </h4>
          <div className="flex flex-col items-start gap-10 max-md:items-start max-md:gap-5 max-md:self-stretch">
            <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
              <h5 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]">
                1차 서류 모집
              </h5>
              <div className="flex items-start gap-3 pt-0.5 max-md:gap-2">
                <div className="flex items-center gap-3 max-md:gap-2">
                  <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                    11월 24일(월)
                  </p>
                  <div className="w-10 h-0.5 bg-[#222227] max-md:h-px" />
                </div>
                <div className="flex flex-col items-start gap-0.5 max-md:w-[7.2rem]">
                  <p className="text-[#222227] text-xl font-medium leading-[160%] self-stretch max-md:text-sm">
                    11월 30일(일)
                  </p>
                  <p className="text-[#222227] text-xl font-medium leading-[160%] self-stretch max-md:text-sm">
                    오후 11시 59분 까지
                  </p>
                </div>
              </div>
            </div>
            <hr className="h-px self-stretch bg-[rgba(70,134,255,0.20)]" />
            <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
              <h5 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]">
                1차 결과 발표
              </h5>
              <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                12월 2일(화)
              </p>
            </div>

            <hr className="h-px self-stretch bg-[rgba(70,134,255,0.20)]" />
            <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
              <h5 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]">
                2차 대면 면접
              </h5>
              <div className="flex flex-col items-start pt-0.5 gap-4 max-md:gap-3">
                <div className="flex items-center gap-3 self-stretch max-md:gap-2">
                  <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                    12월 3일(수)
                  </p>
                  <div className="w-10 h-0.5 bg-[#222227] max-md:h-px" />
                  <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                    12월 6일(토)
                  </p>
                </div>

                <p
                  className="text-[#80808B] text-base font-medium leading-[160%]
                max-md:self-stretch max-md:text-xs max-md:leading-[150%]"
                >
                  *면접 일정 및 장소는 추후 안내
                </p>
              </div>
            </div>
            <hr className="h-px self-stretch bg-[rgba(70,134,255,0.20)]" />
            <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
              <h5 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]">
                최종 결과 발표
              </h5>
              <div className="flex flex-col items-start w-[7.75rem] pt-0.5 gap-4 max-md:w-[4.6875rem] max-md:gap-3">
                <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                  12월 7일(화)
                </p>
                <p className="text-[#80808B] text-base font-medium leading-[160%] max-md:text-xs max-md:leading-[150%]">
                  *개별 안내 예정
                </p>
              </div>
            </div>
            <hr className="h-px self-stretch bg-[rgba(70,134,255,0.20)]" />
            <div className="flex h-[5.125rem] items-start gap-[5.875rem] max-md:flex-col max-md:gap-4">
              <h5 className="text-[#222227] text-[1.75rem] font-bold leading-[150%] w-[14.4375rem] max-md:text-lg  max-md:leading-[160%]">
                합격자 온보딩 워크샵
              </h5>
              <div className="flex flex-col items-start pt-0.5 gap-4 max-md:gap-3">
                <div className="flex items-center gap-3 self-stretch max-md:gap-2">
                  <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                    1월 3일(토)
                  </p>
                  <div className="w-10 h-0.5 bg-[#222227] max-md:h-px" />
                  <p className="text-[#222227] text-xl font-medium leading-[160%] max-md:self-stretch max-md:text-sm">
                    1월 4일(일)
                  </p>
                </div>

                <p
                  className="text-[#80808B] text-base font-medium leading-[160%] max-md:self-stretch
                max-md:text-xs max-md:leading-[150%]"
                >
                  *1박 2일 참여 필수
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
