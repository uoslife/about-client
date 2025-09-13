'use client';
import { createContext, MutableRefObject, useRef, useState } from 'react';

type PeopleContextType = {
  selectedGeneration: number;
  setSelectedGeneration: (generation: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  queryText: MutableRefObject<string>;
};

export const PeopleContext = createContext<PeopleContextType | null>(null);

export const PeopleProvider = ({ children }: { children: React.ReactNode }) => {
  const queryText = useRef('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState(-1);

  return (
    <PeopleContext.Provider
      value={{
        selectedGeneration,
        setSelectedGeneration,
        searchQuery,
        setSearchQuery,
        queryText,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
