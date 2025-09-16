'use client';
import { useRouter } from 'next/navigation';
import { Text } from '@/shared/component/Text';
import { ArticleListItem } from '@uoslife/api';
import Image from 'next/image';

interface PrevNextProps {
  prevArticle?: ArticleListItem;
  nextArticle?: ArticleListItem;
  currentType: string; // tech, career, moments
}

const ArticleCard = ({
  article,
  type,
}: {
  article: ArticleListItem;
  type: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${type}/${article.id}`);
  };

  return (
    <div
      className="flex gap-5 items-start justify-start w-full cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-[30px] items-start justify-start flex-1 min-w-0">
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <Text
            variant="title-24-b"
            color="grey-900"
            className="group-hover:text-primary-ui transition-colors duration-200 leading-[1.5]"
          >
            {article.title}
          </Text>
          {article.category && (
            <div className="bg-grey-100 rounded-[20px] px-4 py-0 h-9 flex items-center">
              <Text variant="body-16-m" color="grey-500">
                {article.category}
              </Text>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center justify-start">
          <Text variant="body-16-b" color="grey-700" className="truncate">
            {article.authorName}
          </Text>
          <div className="bg-grey-200 h-2.5 w-px rounded" />
          <Text variant="body-16-m" color="grey-500">
            {new Date(article.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </div>
      </div>
      {article.thumbnailUrl && (
        <div className="relative h-36 w-60 rounded-xl overflow-hidden shrink-0">
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
    </div>
  );
};

export const PrevNext = ({
  prevArticle,
  nextArticle,
  currentType,
}: PrevNextProps) => {
  return (
    <div className="flex flex-col gap-[60px] items-start justify-start w-full">
      {/* 이전 글 */}
      {prevArticle && (
        <div className="flex gap-[104px] items-start justify-start w-full">
          <div className="flex items-center justify-center pt-[3px] shrink-0 w-[80px]">
            <Text variant="body-16-b" color="grey-500">
              이전 글
            </Text>
          </div>
          <ArticleCard article={prevArticle} type={currentType} />
        </div>
      )}

      {/* 구분선 */}
      {(prevArticle || nextArticle) && (
        <div className="bg-grey-200 h-px w-full" />
      )}

      {/* 다음 글 */}
      {nextArticle && (
        <div className="flex gap-[104px] items-start justify-start w-full">
          <div className="flex items-center justify-center pt-[3px] shrink-0 w-[80px]">
            <Text variant="body-16-b" color="grey-500">
              다음 글
            </Text>
          </div>
          <ArticleCard article={nextArticle} type={currentType} />
        </div>
      )}
    </div>
  );
};
