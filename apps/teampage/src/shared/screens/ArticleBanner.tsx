import { Text } from '@/shared/component/Text';

export function ArticleBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-[140px] md:h-[340px] w-full bg-black bg-[url('/img/Banner.png')] bg-cover bg-center">
      <div className="flex flex-col px-4 md:px-[100px] gap-1 md:gap-2 items-start justify-end pb-4 md:pb-16 mx-auto h-full max-w-pc">
        <Text
          variant="heading-72-b"
          color="primary-gradiant-minified"
          className="text-[24px] md:text-[72px]"
        >
          {title}
        </Text>
        <Text
          variant="title-24-b"
          color="white"
          className="text-[12px] md:text-[24px] whitespace-pre-line"
        >
          {description}
        </Text>
      </div>
    </div>
  );
}
