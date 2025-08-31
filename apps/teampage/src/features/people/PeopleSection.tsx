'use client';
import Tab from './Tab';
import PeopleCard from './PeopleCard';
import { useContext } from 'react';
import { PeopleContext, PeopleProvider } from './PeopleProvider';
import { PeopleData } from '@features/notion/NotionType';

const PeopleSectionContent = ({ peopleData }: { peopleData: PeopleData[] }) => {
  const { selectedGeneration, setSelectedGeneration } =
    useContext(PeopleContext)!;

  const sortGenerationWithNumber = (a: string, b: string) => {
    return Number(a.slice(0, -1)) - Number(b.slice(0, -1));
  };

  const generations = Array.from(
    new Set(peopleData.map((person) => person.generation)),
  ).sort(sortGenerationWithNumber);

  return (
    <main className="flex flex-col items-center justify-center py-[100px]">
      <Tab
        tabs={generations}
        selectedIdx={selectedGeneration}
        onChange={(idx) => {
          setSelectedGeneration(idx);
        }}
      />
      <div className="flex gap-5">
        {peopleData
          .filter(
            (person) => person.generation === generations[selectedGeneration],
          )
          .map((person, index) => (
            <PeopleCard key={`${person.name}-${index}`} person={person} />
          ))}
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
