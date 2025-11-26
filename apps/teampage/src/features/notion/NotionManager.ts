import { SingletonRegister, Singletons } from '@shared/utils/SingletonRegistry';
import { NotionClient } from './NotionClient';
import { NotionUtil } from './NotionUtil';
import type { PeopleData, NotionListResponse } from './NotionType';
import fs from 'fs';
import path from 'path';

const TOKEN = 'NOTION_MANAGER' as const;
@SingletonRegister(TOKEN)
export class NotionManager {
  public static TOKEN = TOKEN;

  private getNotionList = async (): Promise<NotionListResponse> => {
    const notion = Singletons[NotionClient.TOKEN].getInstance();
    if (!process.env.NOTION_PEOPLE_DATABASE_ID) {
      throw new Error('NOTION_PEOPLE_DATABASE_ID is not set');
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_PEOPLE_DATABASE_ID,
    });

    return NotionUtil.parseNotionList(response);
  };

  private downloadAndSaveImage = async (notionImageUrl: string, personName: string): Promise<string> => {
    try {
      const safeName = personName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
      const filename = `${safeName}.jpg`;
      const imagesDir = path.join(process.cwd(), 'public', 'images', 'people');
      const filepath = path.join(imagesDir, filename);
      if (fs.existsSync(filepath)) {
        return `/images/people/${filename}`;
      }

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const response = await fetch(notionImageUrl, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      await fs.promises.writeFile(filepath, new Uint8Array(buffer));

      return `/images/people/${filename}`;
    } catch (error) {
      console.error('Failed to download image:', error);
      return notionImageUrl;
    }
  };

  public getPeopleData = async (): Promise<PeopleData[]> => {
    try {
      const list = await this.getNotionList();
      const peopleData: PeopleData[] = await Promise.all(
        list.results.map(async (page) => {
          const data = NotionUtil.convertToPeopleData(page);
          if (data.image_profile) {
            data.image_profile = await this.downloadAndSaveImage(data.image_profile, data.name);
          }
          return data;
        }),
      );

      return peopleData;
    } catch (error) {
      console.error('Failed to get people data from Notion', error);
      return [];
    }
  };
}

declare module '@shared/utils/SingletonRegistry' {
  interface SingletonRegistry {
    [TOKEN]: NotionManager;
  }
}
