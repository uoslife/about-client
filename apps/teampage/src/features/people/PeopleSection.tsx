'use client';
import PeopleCard from './PeopleCard';
import { useContext, useMemo, useState } from 'react';
import { PeopleContext, PeopleProvider } from './PeopleProvider';
import { PeopleData } from '@features/notion/NotionType';
import { SearchField } from '@/shared/component/search-field';
import { Dropdown } from '@/shared/component/dropdown';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { NoQueryResultFallback } from '@/shared/component/NoQueryResultFallback';

const sortGenerationWithNumber = (a: string, b: string) => {
  return Number(a.slice(0, -1)) - Number(b.slice(0, -1));
};

const PeopleSectionContent = ({ peopleData }: { peopleData: PeopleData[] }) => {
  const { selectedGeneration, searchQuery } = useContext(PeopleContext)!;

  const generations = useMemo(
    () => [
      '전체 기수',
      ...Array.from(new Set(peopleData.map((person) => person.generation)))
        .sort(sortGenerationWithNumber)
        .reverse(),
    ],
    [peopleData],
  );

  const filteredPeopleData = useMemo(() => {
    return peopleData
      .filter(
        (person) =>
          selectedGeneration === -1 ||
          person.generation === generations[selectedGeneration],
      )
      .filter(
        (person) =>
          person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.career?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.generation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.position.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [peopleData, selectedGeneration, searchQuery, generations]);

  return (
    <main className="flex flex-col">
      <ArticleBanner
        title="People"
        description="서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다."
      />
      <div className="flex items-center justify-center py-[100px]">
        <div className="w-[1120px] flex flex-col gap-10">
          <PeopleHeader generations={generations} />
          <div className="flex gap-5 flex-wrap">
            {filteredPeopleData.map((person, index) => (
              <PeopleCard key={`${person.name}-${index}`} person={person} />
            ))}
            {filteredPeopleData.length === 0 && (
              <NoQueryResultFallback message="검색 결과가 없습니다." />
            )}
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
    setSearchQuery,
    selectedGeneration,
    setSelectedGeneration,
    queryText,
  } = useContext(PeopleContext)!;

  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <SearchField
        size="small"
        placeholder="제목을 검색하세요."
        defaultValue=""
        onChange={(e) => {
          if (e.target.value === '') setSearchQuery('');
          queryText.current = e.target.value;
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onClear={() => {
          queryText.current = '';
          setSearchQuery('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isComposing) {
            setSearchQuery(queryText.current);
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
