import type { ArticleListItem } from '@uoslife/api';

export type CardProps = {
  content: ArticleListItem;
  link: string;
  className?: string;
  showViewCount?: boolean;
};
