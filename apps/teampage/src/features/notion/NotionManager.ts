import { SingletonRegister, Singletons } from "@shared/utils/SingletonRegistry";
import { NotionClient } from "./NotionClient";
import { NotionUtil } from "./NotionUtil";
import type { PeopleData, NotionListResponse } from "./NotionType";

const TOKEN = "NOTION_MANAGER" as const;
@SingletonRegister(TOKEN)
export class NotionManager {
  public static TOKEN = TOKEN;

  private getNotionList = async (): Promise<NotionListResponse> => {
    const notion = Singletons[NotionClient.TOKEN].getInstance();
    if (!process.env.NOTION_PEOPLE_DATABASE_ID) {
      throw new Error("NOTION_PEOPLE_DATABASE_ID is not set");
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_PEOPLE_DATABASE_ID,
    });

    return NotionUtil.parseNotionList(response);
  };

  public getPeopleData = async (): Promise<PeopleData[]> => {
    try {
      const list = await this.getNotionList();
      const peopleData: PeopleData[] = list.results.map((page) => {
        return NotionUtil.convertToPeopleData(page);
      });

      return peopleData;
    } catch (error) {
      console.error("Failed to get people data from Notion", error);
      return [];
    }
  };
}

declare module "@shared/utils/SingletonRegistry" {
  interface SingletonRegistry {
    [TOKEN]: NotionManager;
  }
}
