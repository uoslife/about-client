'use client';
import { createContext, useState } from 'react';

type PeopleContextType = {
  selectedGeneration: number;
  setSelectedGeneration: (generation: number) => void;
};

export const PeopleContext = createContext<PeopleContextType | null>(null);

export const PeopleProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGeneration, setSelectedGeneration] = useState(0);
  return (
    <PeopleContext.Provider
      value={{ selectedGeneration, setSelectedGeneration }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
