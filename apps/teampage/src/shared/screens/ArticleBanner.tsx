import { Text } from '@/shared/component/Text';

export function ArticleBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-[180px] md:h-[340px] w-full bg-black bg-[url('/img/Banner.png')] bg-cover bg-center">
      <div className="flex flex-col px-4 md:px-[100px] gap-1 md:gap-2 items-start justify-end pb-4 md:pb-16 mx-auto h-full max-w-pc">
        <Text
          variant={{ initial: 'title-24-b', sm: 'heading-72-b' }}
          color="primary-gradiant-minified"
          className="whitespace-pre-line"
        >
          {title}
        </Text>

        <Text
          variant={{ initial: 'body-14-b', sm: 'title-24-b' }}
          color="white"
          className="whitespace-pre-line"
        >
          {description}
        </Text>
      </div>
    </div>
  );
}
