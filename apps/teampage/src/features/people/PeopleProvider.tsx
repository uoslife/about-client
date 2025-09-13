'use client';
import { createContext, useState } from 'react';

type PeopleContextType = {
  selectedGeneration: number;
  setSelectedGeneration: (generation: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const PeopleContext = createContext<PeopleContextType | null>(null);

export const PeopleProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGeneration, setSelectedGeneration] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PeopleContext.Provider
      value={{
        selectedGeneration,
        setSelectedGeneration,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
