import { Tag } from '@/shared/component/Tag';
import { Text } from '@/shared/component/Text';

export type PostType = 'tech' | 'career' | 'moments';

type BasePostHeaderProps = {
  type: PostType;
  title: string;
  authorName: string;
  createdAt: string;
};

type TechPostHeaderProps = BasePostHeaderProps & {
  category: string;
  viewCount: number;
};

type CareerPostHeaderProps = BasePostHeaderProps & {
  category: string;
  viewCount: number;
};

interface PostHeaderProps extends TechPostHeaderProps, CareerPostHeaderProps {}

export const PostHeader = ({
  type,
  title,
  category,
  authorName,
  createdAt,
  viewCount,
}: PostHeaderProps) => {
  return (
    <div className="flex flex-col gap-7 items-start justify-start w-full">
      <div className="flex flex-col gap-5 items-start justify-start w-full">
        <Text variant="title-48-b" color="grey-900" className="w-full" as="h1">
          {title}
        </Text>

        {category && <Tag color="white">{category}</Tag>}
      </div>

      <div className="flex items-start justify-between w-full">
        <div className="flex gap-3 items-center">
          <Text variant="body-18-m" color="grey-500">
            {authorName}
          </Text>
          <div className="bg-grey-400 h-2.5 w-px" />
          <Text variant="body-18-m" color="grey-500">
            {new Date(createdAt).toLocaleDateString('ko-KR')}
          </Text>
          {type === 'tech' ||
            (type === 'career' && (
              <>
                <div className="bg-grey-400 h-2.5 w-px" />
                <Text variant="body-18-m" color="grey-500">
                  조회수 {viewCount.toLocaleString()}
                </Text>
              </>
            ))}
        </div>

        <div className="flex gap-2 items-center">
          <Text variant="body-14-m" color="grey-500">
            수정
          </Text>
          <div className="bg-grey-100 h-2.5 rounded w-px" />
          <Text variant="body-14-m" color="grey-500">
            삭제
          </Text>
        </div>
      </div>

      <div className="bg-grey-100 h-px w-full" />
    </div>
  );
};
