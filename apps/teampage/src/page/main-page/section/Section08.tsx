import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function Section08() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-black gap-28 py-28">
      <Image
        src="/img/section08_bg.webp"
        alt="section 09 background"
        fill
        className="absolute top-0 left-0"
      />
      <div className="z-10 flex flex-col gap-8 w-full max-w-pc">
        <div className="flex flex-col gap-2">
          <Text variant="title-28-m" color="white">
            Interview
          </Text>
          <Text as="h2" variant="heading-72-b" color="white">
            시대생 멤버들이 전하는 경험과 성장
          </Text>
        </div>
        <Text
          variant="title-24-m"
          className="whitespace-pre-line"
          color="grey-100"
        >
          {
            '졸업생, 대표단, 현 활동 멤버까지 —\n시대생을 통해 어떤 배움과 변화를 얻었는지 생생한 경험담을 확인해보세요.'
          }
        </Text>
      </div>
      {/* TODO: Fill content */}
    </div>
  );
}
