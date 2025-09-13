import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function ArticleListEmptyContainer() {
  return (
    <div className="py-24 flex flex-col items-center justify-center">
      <Image
        width={80}
        height={104}
        src={'/img/roomae_not_found.png'}
        alt="roomae character"
      />

      <Text variant="body-18-m" color="grey-700">
        게시글이 존재하지 않습니다.
      </Text>
    </div>
  );
}
