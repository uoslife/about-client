import { CardA } from './CardA';
import { CardB } from './CardB';
import {
  CardASkeleton,
  CardASkeletonList,
  CardBSkeleton,
  CardBSkeletonList,
} from './CardSkeleton';

interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return <>{children}</>;
}

function CardSkeleton({ children }: CardProps) {
  return <>{children}</>;
}
function CardSkeletonList({ children }: CardProps) {
  return <>{children}</>;
}

Card.A = CardA;
Card.B = CardB;

CardSkeleton.A = CardASkeleton;
CardSkeleton.B = CardBSkeleton;

CardSkeletonList.A = CardASkeletonList;
CardSkeletonList.B = CardBSkeletonList;

export { Card, CardSkeleton, CardSkeletonList };
