import { CardA } from './CardA';
import { CardB } from './CardB';

// import { CardB } from './CardB'; // Placeholder for CardB

interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return <>{children}</>;
}

Card.A = CardA;
Card.B = CardB;

export { Card };
