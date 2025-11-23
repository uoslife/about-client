import '../src/shared/utils/SingletonRegistry';
import { Singletons } from '@shared/utils/SingletonRegistry';
import { NotionManager } from '../src/features/notion';

async function main() {
  try {
    const notionManager = Singletons[NotionManager.TOKEN];
    const peopleData = await notionManager.getPeopleData();

    console.log(`✅ Successfully downloaded ${peopleData.length} people profiles`);
  } catch (error) {
    console.error('❌ Failed to download people images:', error);
    process.exit(1);
  }
}

main();
