import { SingletonRegister, Singletons } from '@shared/utils/SingletonRegistry';
import { NotionClient } from './NotionClient';
import { NotionUtil } from './NotionUtil';
import type { PeopleData, RowFailure } from './NotionType';
import { reportDataFailures } from '@shared/utils/reportDataFailures';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TOKEN = 'NOTION_MANAGER' as const;
@SingletonRegister(TOKEN)
export class NotionManager {
  public static TOKEN = TOKEN;

  private fetchRawList = async (): Promise<unknown> => {
    const notion = Singletons[NotionClient.TOKEN].getInstance();
    if (!process.env.NOTION_PEOPLE_DATABASE_ID) {
      throw new Error('NOTION_PEOPLE_DATABASE_ID is not set');
    }
    return notion.databases.query({
      database_id: process.env.NOTION_PEOPLE_DATABASE_ID,
    });
  };

  private downloadAndSaveImage = async (notionImageUrl: string, personName: string): Promise<string> => {
    try {
      const safeName = personName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
      const optimizedFilename = `${safeName}.webp`;
      const imagesDir = path.join(process.cwd(), 'public', 'images', 'people');
      const optimizedFilepath = path.join(imagesDir, optimizedFilename);

      if (fs.existsSync(optimizedFilepath)) {
        return `/images/people/${optimizedFilename}`;
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

      await sharp(Buffer.from(buffer))
        .rotate()
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(optimizedFilepath);

      return `/images/people/${optimizedFilename}`;
    } catch (error) {
      console.error('Failed to download image:', error);
      return notionImageUrl;
    }
  };

  public getPeopleData = async (): Promise<PeopleData[]> => {
    const raw = await this.fetchRawList();
    const { valid, failures } = NotionUtil.parseNotionListSafe(raw);

    const settled = await Promise.allSettled(
      valid.map(async (page) => {
        const data = NotionUtil.convertToPeopleData(page);
        if (data.image_profile) {
          data.image_profile = await this.downloadAndSaveImage(
            data.image_profile,
            data.name,
          );
        }
        return data;
      }),
    );

    const convertFailures: RowFailure[] = settled.flatMap((s, i) =>
      s.status === 'rejected'
        ? [{ index: i, issues: [String(s.reason?.message ?? s.reason)] }]
        : [],
    );

    const all = [...failures, ...convertFailures];
    if (all.length > 0) {
      void reportDataFailures('people', all, settled.length - convertFailures.length);
    }

    return settled.flatMap((s) => (s.status === 'fulfilled' ? [s.value] : []));
  };
}

declare module '@shared/utils/SingletonRegistry' {
  interface SingletonRegistry {
    [TOKEN]: NotionManager;
  }
}
