import { Text } from '@/shared/component/Text';

export function ArticleBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-[340px] w-full bg-black bg-[url('/img/Banner.png')] bg-cover bg-center">
      <div className="flex flex-col gap-2 items-start justify-end pb-16 mx-auto h-full max-w-pc">
        <Text variant="heading-72-b" color="primary-gradiant-minified">
          {title}
        </Text>
        <Text variant="title-24-b" color="white">
          {description}
        </Text>
      </div>
    </div>
  );
}
