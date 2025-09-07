export type CardProps = {
  content: Content;
  link: string;
  className?: string;
};

export type Content = {
  id: number;
  authorId: string;
  authorName: string;
  thumbnailUrl: string;
  title: string;
  summary?: string;
  category?: string;
  viewCount?: number;
  createdAt: string;
};
