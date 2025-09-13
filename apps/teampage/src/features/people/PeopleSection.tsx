'use client';
import PeopleCard from './PeopleCard';
import { useContext } from 'react';
import { PeopleContext, PeopleProvider } from './PeopleProvider';
import { PeopleData } from '@features/notion/NotionType';
import { SearchField } from '@/shared/component/search-field';
import { Dropdown } from '@/shared/component/dropdown';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';

const PeopleSectionContent = ({ peopleData }: { peopleData: PeopleData[] }) => {
  const { selectedGeneration, searchQuery } = useContext(PeopleContext)!;

  const sortGenerationWithNumber = (a: string, b: string) => {
    return Number(a.slice(0, -1)) - Number(b.slice(0, -1));
  };

  const generations = [
    '전체 기수',
    ...Array.from(new Set(peopleData.map((person) => person.generation)))
      .sort(sortGenerationWithNumber)
      .reverse(),
  ];

  return (
    <main className="flex flex-col">
      <ArticleBanner
        title="People"
        description="서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다."
      />
      <div className="flex items-center justify-center py-[100px]">
        <div className="w-[1120px] flex flex-col gap-10">
          <PeopleHeader generations={generations} />
          <div className="flex gap-5">
            {peopleData
              .filter(
                (person) =>
                  selectedGeneration === -1 ||
                  person.generation === generations[selectedGeneration],
              )
              .filter((person) =>
                person.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((person, index) => (
                <PeopleCard key={`${person.name}-${index}`} person={person} />
              ))}
          </div>
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

const PeopleHeader = ({ generations }: { generations: string[] }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGeneration,
    setSelectedGeneration,
  } = useContext(PeopleContext)!;

  return (
    <div className="w-full flex justify-between items-center">
      <SearchField
        size="small"
        placeholder="제목을 검색하세요."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
      />
      <Dropdown
        options={generations}
        value={
          selectedGeneration === -1
            ? generations[0]
            : generations[selectedGeneration]
        }
        onChange={(_, index) => setSelectedGeneration(index === 0 ? -1 : index)}
        placeholder="전체 기수"
      />
    </div>
  );
};
