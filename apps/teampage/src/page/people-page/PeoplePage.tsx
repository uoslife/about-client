import { Singletons } from '@shared/utils/SingletonRegistry';
import { NotionManager } from '@features/notion';
import PeopleSection from '@/features/people/PeopleSection';
import { MOCK_PEOPLE_DATA } from '@/shared/mocks/data';

export default async function PeoplePage() {
  // 로컬 프로토타이핑에서는 실 Notion API 키를 설정하지 않으므로 목데이터로 대체한다.
  if (!process.env.NOTION_API_KEY) {
    return <PeopleSection peopleData={MOCK_PEOPLE_DATA} />;
  }

  const notionManager = Singletons[NotionManager.TOKEN];
  const peopleData = await notionManager.getPeopleData();
  return <PeopleSection peopleData={peopleData} />;
}
