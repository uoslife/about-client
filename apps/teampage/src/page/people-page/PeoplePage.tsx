import { Singletons } from '@shared/utils/SingletonRegistry';
import { NotionManager } from '@features/notion';
import PeopleSection from '@/features/people/PeopleSection';

export const revalidate = false;

export default async function PeoplePage() {
  const notionManager = Singletons[NotionManager.TOKEN];
  const peopleData = await notionManager.getPeopleData();
  return <PeopleSection peopleData={peopleData} />;
}
