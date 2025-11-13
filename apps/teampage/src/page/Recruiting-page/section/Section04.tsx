import { Text } from '@shared/component/Text';
import Image from 'next/image';

export async function Section04() {
  return (
    <div className="relative flex flex-col items-center py-[60px] h-[450px] max-md:max-h-[150px] max-md:py-4">
      <Image
        src="/img/section06_bg.webp"
        alt="section06 background"
        fill
        placeholder="blur"
        blurDataURL="/img/section06_bg.webp"
        unoptimized
        className="object-cover -z-10 max-md:max-h-[140px]"
      />
      <Text
        variant="title-48-b"
        color="white"
        className="whitespace-pre-line max-md:text-title-24-b"
      >
        {`함께 몰입하고, 함께 웃으며\n성장의 즐거움을 경험해요.`}
      </Text>
    </div>
  );
}
