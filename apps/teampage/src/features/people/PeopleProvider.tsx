'use client';
import { createContext, useState, useEffect } from 'react';

type PeopleContextType = {
  selectedGeneration: number;
  setSelectedGeneration: (generation: number) => void;
  searchQuery: string;
  debouncedSearchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const PeopleContext = createContext<PeopleContextType | null>(null);

export const PeopleProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGeneration, setSelectedGeneration] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <PeopleContext.Provider
      value={{
        selectedGeneration,
        setSelectedGeneration,
        searchQuery,
        debouncedSearchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
