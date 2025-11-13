import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export async function SectionMain() {
  return (
    <div className="h-[100vh] w-[100vw] px-10 max-md:h-fit">
      <div
        className="
          relative w-full overflow-hidden flex items-center bg-black
          justify-center h-[90vh] rounded-[60px] 
          max-md:h-[360px] max-md:rounded-[20px] max-md:items-start
        "
      >
        <div className="relative w-full h-full max-md:h-[50%]">
          <Image
            src="/main.webp"
            alt="Uoslife Logo"
            priority
            fill
            className="object-cover opacity-0 animate-fadeIn"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
        <div className="absolute inset-0 main_bg"></div>
        <div className="sm:flex sm:flex-end absolute xl:h-[85vh] 2xl:h-[83vh] w-full h-full bottom-0 flex flex-col items-center justify-between max-md:justify-end">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="absolute top-1 px-10 max-w-[1280px] mx-auto flex flex-col w-full gap-6 items-center">
              <div className="flex flex-col w-full gap-6">
                <div className="hidden md:flex ml-32 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start hover:scale-105 transition-transform duration-200">
                  <p className="text-[28px] text-white">UX/UI Design</p>
                </div>
                <div className="hidden md:flex py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start hover:scale-105 transition-transform duration-200">
                  <p className="text-[28px] text-white">Product Management</p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-6">
                <div className="hidden md:flex mr-14 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end hover:scale-105 transition-transform duration-200">
                  <p className="text-[28px] text-white">FE/BE Develop</p>
                </div>
                <div className="hidden md:flex py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end hover:scale-105 transition-transform duration-200">
                  <p className="text-[28px] text-white">Marketing</p>
                </div>
              </div>
            </div>
            <section className="h-full z-10 gap-4 flex flex-col items-center justify-end text-center">
              <div className="flex flex-col gap-4 max-md:gap-6">
                <Text
                  variant="heading-100-b"
                  as="h1"
                  color="white"
                  className="text-center whitespace-pre-line max-md:text-[33px] max-md:whitespace-normal"
                >
                  {'시대생, 모든 시대인을\n— 연결하다'}
                </Text>
                <Text
                  as="h2"
                  variant="title-28-m"
                  color="grey-100"
                  className="max-md:text-[12px] max-md:leading-[16px] max-md:whitespace-pre-line"
                >
                  {'UOSLIFE —\n Connecting Everyone at UOS'}
                </Text>
              </div>
              <Link
                href="/#section01"
                className="hidden md:flex py-6 animate-bounce cursor-pointer"
              >
                <Image
                  src="/svg/main_page_arrow_down.svg"
                  alt="main page arrow down button"
                  width={72}
                  height={72}
                />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
