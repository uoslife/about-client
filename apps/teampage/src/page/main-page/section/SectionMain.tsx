import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export function SectionMain() {
  return (
    <div className="relative h-[85vh] mx-10 rounded-3xl overflow-hidden flex items-center justify-center">
      <Image
        src="/main.webp"
        alt="Uoslife Logo"
        width={1800}
        height={1800}
        priority
        className="object-cover h-[85vh] pb-60"
      />
      <div className="absolute h-[860px] -z-10 w-full bottom-0 left-0 rounded-[60px] main_bg" />

      <div className="absolute xl:h-[80vh] 2xl:h-[75vh] h-[70vh] bottom-0 flex flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <div className="px-10 max-w-[1280px] mx-auto flex flex-col w-full gap-6 items-center">
            <div className="flex flex-col w-full gap-6">
              <div className="ml-32 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start">
                <p className="text-[28px] text-white">UX/UI Design</p>
              </div>
              <div className="py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start">
                <p className="text-[28px] text-white">Product Management</p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="mr-14 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end">
                <p className="text-[28px] text-white">FE/BE Develop</p>
              </div>
              <div className="py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end">
                <p className="text-[28px] text-white">Marketing</p>
              </div>
            </div>
          </div>
          <div className="z-10 gap-4 flex flex-col items-center">
            <Text
              variant="heading-100-b"
              as="h1"
              color="white"
              className="whitespace-pre-line text-center"
            >
              {'시대생,\n모든 시대인을 — 연결하다'}
            </Text>
            <Text as="h2" variant="title-28-m" color="grey-100">
              UOSLIFE — Connecting Everyone at UOS
            </Text>
          </div>
        </div>
        <Link href="/#section01" className="mb-6 animate-bounce cursor-pointer">
          <Image
            src="/svg/main_page_arrow_down.svg"
            alt="main page arrow down button"
            width={72}
            height={72}
          />
        </Link>
      </div>
    </div>
  );
}
