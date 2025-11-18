'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function RecruitPage() {
  const logos = Array.from({ length: 9 }, (_, i) => `/svg/logo/${i + 1}.svg`);
  const infiniteLogos = [...logos, ...logos];

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-20">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex w-full max-w-[1440px] flex-col gap-16">
          {/* 메인 텍스트 */}
          <div className="flex w-full flex-col gap-8 text-left">
            <p className="text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">
              UOSLIFE
            </p>
            <p className="ml-[520px] text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">
              6기 모집
            </p>
            <div className="mt-[-100px] flex flex-col gap-2 text-[18px] font-medium text-[#222227]">
              <div className="flex items-center gap-3">
                <p>11월 24일부터</p>
                <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
              </div>
              <p>11월 30일까지</p>
            </div>
          </div>

          {/* "6기 지원하기" 버튼 - 하단 중앙 */}
          <div className="mt-[-20px] flex justify-center">
            <button
              type="button"
              className="flex h-14 w-[200px] items-center justify-center rounded-xl bg-[#222227] text-white transition-colors hover:bg-[#1a1a1f]"
            >
              <span className="text-[18px] font-bold">6기 지원하기</span>
            </button>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-12 lg:flex-row lg:items-center lg:gap-24">
          <div className="flex flex-col gap-4 text-left lg:min-w-[360px]">
            <h2 className="text-[42px] font-bold text-[#222227]">
              Team{' '}
              <span className="bg-gradient-to-r from-[#0F6EFB] to-[#6AB5FF] bg-clip-text text-transparent">
                UOSLIFE
              </span>
            </h2>
            <Link
              href="/"
              className="flex items-center gap-2 text-[18px] font-semibold text-[#222227] transition-colors hover:text-[#0F6EFB]"
            >
              시대생 자세히 알아보기
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-6 text-[18px] leading-[1.8] text-[#222227] lg:max-w-[600px]">
            <p>
              UOSLIFE(시대생)는 서울시립대학교 학우들에게 편리하고 즐거운 학교생활을 위한 서비스를 만들어가는
              IT 소프트웨어 동아리입니다. 시대생 앱을 운영하며 시간표, 공지사항, 시대팅 등 대학 생활을 위한 다양한
              서비스를 제공하고 있습니다.
            </p>
            <p>
              2026년에는 대학 생활의 본질적 가치를 확장하는 새로운 기능과 경험을 선보이며, 학우들의 일상 속에 더욱 깊이
              스며드는 플랫폼으로 성장할 것입니다. 아울러 구성원들이 자율적으로 협업하고 함께 배우는 문화를 바탕으로,
              캠퍼스 내에서 지속 가능한 IT 생태계를 만들어 나가고자 합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-8 text-center">
          <h2 className="text-[48px] font-bold text-[#222227]">Synergize with Alumni</h2>
          <div className="flex flex-col gap-1 text-[18px] leading-[1.8] text-[#222227]">
            <p>
              샌프란시스코 실리콘밸리의 성공 배경에는, Pay it forward라 불리는 IT 업계 선후배 사이의 멘토 문화가
              핵심으로 자리 잡고 있습니다.
            </p>
            <p>
              그리고 UOSLIFE는 업계 다방면에서 활동하는 선배들과 직접 소통하며 성장할 수 있는 곳입니다.
            </p>
            <p>
              'UOSLIFE'는 5년 전 시작한 시대생 앱을 시작으로 선후배가 함께 어우러져 다양한 IT 서비스를 운영하고
              있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-16">
          {/* 제목 */}
          <h2 className="text-[36px] font-bold text-[#222227]">멘토 소개</h2>

          {/* 카드 반복 렌더링 */}
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center rounded-2xl bg-white px-10 py-12 shadow-md min-h-[320px]"
              >
                {/* 이미지 placeholder */}
                <div className="mb-8 h-[140px] w-[140px] rounded-full bg-gray-200" />

                {/* 텍스트 */}
                <p className="text-[20px] font-bold text-[#222227]">Company</p>
                <p className="mt-1 text-[16px] text-[#666666]">Role</p>
                <p className="mt-4 text-[16px] text-[#222227]">Name</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden py-16 bg-white">
        <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-6 text-center px-6">
          {/* 제목 */}
          <h2 className="text-[42px] font-bold text-[#222227]">Alumni Network</h2>

          {/* 설명문 */}
          <p className="text-[18px] leading-[1.8] text-[#222227]">
            네이버, 카카오페이, 라인, 리멤버 등 국내 최고의 IT 회사부터 SKT, 현대자동차, NH투자증권, 한국은행 등 유수의 대기업/금융권까지
            <br />
            다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.
          </p>

          {/* 캐러셀 */}
          <div className="relative w-full mt-10">
            <div className="flex animate-slide gap-8">
              {infiniteLogos.map((src, idx) => (
                <div
                  key={idx}
                  className="min-w-[200px] h-[200px] rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: 'rgba(70, 134, 255, 0.03)' }}
                >
                  <Image
                    src={src}
                    alt={`logo-${idx}`}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 캐러셀 애니메이션 */}
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-slide {
            animation: slide 18s linear infinite;
          }
        `}</style>
      </section>

      <section className="w-full px-6 py-24 bg-[#f9f9fb]">
        <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-12 text-center">
          <h2 className="text-[36px] font-bold text-[#222227]">
            더 궁금한 게 있다면<br />아래를 통해 문의해 주세요
          </h2>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {/* 카드 1 */}
            <Link
              href="#"
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-10 text-left shadow-md transition hover:shadow-lg min-h-[200px]"
            >
              <p className="text-[24px] font-bold text-[#222227] leading-[1.5]">
                <span className="text-[#0F6EFB]">UOSLIFE</span>에 궁금한 점이나<br />의견이 있다면?
              </p>
              <p className="mt-6 text-[16px] text-[#666666]">시대생 카카오톡 채널 바로가기 ›</p>
            </Link>

            {/* 카드 2 */}
            <Link
              href="#"
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-10 text-left shadow-md transition hover:shadow-lg min-h-[200px]"
            >
              <p className="text-[24px] font-bold text-[#222227] leading-[1.5]">
                <span className="text-[#0F6EFB]">UOSLIFE</span>의 실시간 소식을<br />알고 싶다면?
              </p>
              <p className="mt-6 text-[16px] text-[#666666]">시대생 인스타그램 바로가기 ›</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
