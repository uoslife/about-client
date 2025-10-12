'use client';
import PeopleCard from './PeopleCard';
import { useContext, useMemo, useState } from 'react';
import { PeopleContext, PeopleProvider } from './PeopleProvider';
import { PeopleData } from '@features/notion/NotionType';
import { SearchField } from '@/shared/component/search-field';
import { Dropdown } from '@/shared/component/dropdown';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { NoQueryResultFallback } from '@/shared/component/NoQueryResultFallback';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';

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
    const filtered = peopleData
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

    return filtered.sort((a, b) => {
      if (selectedGeneration === -1) {
        const generationA = Number(a.generation.slice(0, -1));
        const generationB = Number(b.generation.slice(0, -1));
        if (generationA !== generationB) {
          return generationB - generationA;
        }
        return a.name.localeCompare(b.name, 'ko');
      } else {
        const positionOrder = { 대표: 0, 부대표: 1 };
        const orderA =
          positionOrder[a.position as keyof typeof positionOrder] ?? 2;
        const orderB =
          positionOrder[b.position as keyof typeof positionOrder] ?? 2;

        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name, 'ko');
      }
    });
  }, [peopleData, selectedGeneration, searchQuery, generations]);

  return (
    <main className="flex flex-col">
      <ArticleBanner
        title="People"
        description="서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다."
      />
      <div className="flex items-center justify-center py-8 md:py-[100px] px-4 md:px-0">
        <div className="w-full max-w-[1120px] flex flex-col gap-6 md:gap-10 justify-center">
          <PeopleHeader generations={generations} />
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-3 md:gap-5">
            {filteredPeopleData.map((person, index) => (
              <PeopleCard key={`${person.name}-${index}`} person={person} />
            ))}
            {[...Array(3 - (filteredPeopleData.length % 3))].map((_, i) => (
              <div
                key={`dummy-${i}`}
                className="hidden md:block w-[calc((100%/3)-20px)] invisible"
                aria-hidden="true"
              />
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
  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'people',
  });
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
    <div className="w-full flex md:flex-row justify-between items-center gap-4 md:gap-0">
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
