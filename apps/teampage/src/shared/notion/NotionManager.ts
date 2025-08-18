import { SingletonRegister, Singletons } from "@shared/utils/SingletonRegistry";
import { NotionClient } from "./NotionClient";
import { NotionUtil } from "./NotionUtil";
import type { PeopleData, NotionDatabaseResponse } from "./NotionType";

const TOKEN = "NOTION_MANAGER";
@SingletonRegister(TOKEN)
export class NotionManager {
  public static TOKEN = TOKEN;

  private getNotionDatabase = async (): Promise<NotionDatabaseResponse> => {
    const notion = Singletons[NotionClient.TOKEN].getInstance();
    if (!process.env.NOTION_PEOPLE_DATABASE_ID) {
      throw new Error("NOTION_PEOPLE_DATABASE_ID is not set");
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_PEOPLE_DATABASE_ID,
    });

    return NotionUtil.parseNotionDatabase(response);
  };

  public getPeopleData = async (): Promise<PeopleData[]> => {
    try {
      const database = await this.getNotionDatabase();

      const peopleData: PeopleData[] = database.results.map((page) => {
        return NotionUtil.convertToPeopleData(page);
      });

      return peopleData;
    } catch (error) {
      console.error("Failed to fetch or parse people data:", error);
      throw new Error("Failed to get people data from Notion");
    }
  };
}

declare module "@shared/utils/SingletonRegistry" {
  interface SingletonRegistry {
    [TOKEN]: NotionManager;
  }
}
