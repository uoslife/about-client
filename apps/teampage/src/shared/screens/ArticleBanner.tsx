import { Text } from '@/shared/component/Text';
import { isMobile } from '../utils/isMoblie';

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
        {isMobile() ? (
          <MobileContent title={title} description={description} />
        ) : (
          <WebContent title={title} description={description} />
        )}
      </div>
    </div>
  );
}

const MobileContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <Text
        variant="title-36-b"
        color="primary-gradiant-minified"
        className="md:hidden"
      >
        {title}
      </Text>

      <Text variant="body-16-m" color="white" className="md:hidden">
        {description}
      </Text>
    </>
  );
};

const WebContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <Text
        variant="heading-72-b"
        color="primary-gradiant-minified"
        className="hidden md:block"
      >
        {title}
      </Text>
      <Text variant="title-24-b" color="white" className="hidden md:block">
        {description}
      </Text>
    </>
  );
};
