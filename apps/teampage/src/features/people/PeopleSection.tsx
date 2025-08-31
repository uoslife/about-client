'use client';
import PeopleCard from './PeopleCard';
import { useContext } from 'react';
import { PeopleContext, PeopleProvider } from './PeopleProvider';
import { PeopleData } from '@features/notion/NotionType';
import { SearchField } from '@/shared/component/search-field';

const PeopleSectionContent = ({ peopleData }: { peopleData: PeopleData[] }) => {
  const { selectedGeneration, debouncedSearchQuery } =
    useContext(PeopleContext)!;

  const sortGenerationWithNumber = (a: string, b: string) => {
    return Number(a.slice(0, -1)) - Number(b.slice(0, -1));
  };

  const generations = [
    '전체 기수',
    ...Array.from(new Set(peopleData.map((person) => person.generation))).sort(
      sortGenerationWithNumber,
    ),
  ];

  return (
    <main className="flex items-center justify-center py-[100px]">
      <div className="w-[1120px] flex flex-col gap-10">
        <PeopleHeader />
        <div className="flex gap-5">
          {peopleData
            .filter(
              (person) =>
                selectedGeneration === -1 ||
                person.generation === generations[selectedGeneration],
            )
            .filter((person) =>
              person.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()),
            )
            .map((person, index) => (
              <PeopleCard key={`${person.name}-${index}`} person={person} />
            ))}
        </div>
      </div>
    </main>
  );
};

const PeopleSection = ({ peopleData }: { peopleData: PeopleData[] }) => {
  return (
    <PeopleProvider>
      <PeopleSectionContent peopleData={peopleData} />
    </PeopleProvider>
  );
};

export default PeopleSection;

const PeopleHeader = () => {
  const { searchQuery, setSearchQuery } = useContext(PeopleContext)!;
  return (
    <div className="w-full flex justify-between items-center">
      <SearchField
        size="small"
        placeholder="제목을 입력해주세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
      />
    </div>
  );
};
