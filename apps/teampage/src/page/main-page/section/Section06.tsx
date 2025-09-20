import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function Section06() {
  return (
    <div className="relative flex flex-col items-center py-[60px] h-[450px] bg-black/50">
      <Image
        src="/img/section06_bg.webp"
        alt="section06 background"
        fill
        placeholder="blur"
        blurDataURL="/img/section06_bg.webp"
        unoptimized
        className="object-cover -z-10"
      />
      <Text variant="title-48-b" color="white" className="whitespace-pre-line">
        {`함께 몰입하고, 함께 웃으며\n성장의 즐거움을 경험해요.`}
      </Text>
    </div>
  );
}
