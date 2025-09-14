import Image from 'next/image';
import { Text } from './Text';

export const NoQueryResultFallback = ({ message }: { message: string }) => {
  return (
    <div className="w-full py-[100px] flex items-center justify-center">
      <div className="w-full flex flex-col gap-5 items-center">
        <Image src="/img/irumae.png" alt="no-result" width={80} height={104} />
        <Text variant="body-18-m" color="grey-700">
          {message}
        </Text>
      </div>
    </div>
  );
};
