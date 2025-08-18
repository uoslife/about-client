import { SingletonRegister, Singletons } from "@shared/utils/SingletonRegistry";
import { NotionClient } from "./NotionClient";
import { NotionUtil } from "./NotionUtil";

const TOKEN = "NOTION_MANAGER";
@SingletonRegister(TOKEN)
export class NotionManager {
  public static TOKEN = TOKEN;
  private getNotionDatabase = async (): Promise<any> => {
    const notion = Singletons[NotionClient.TOKEN].getInstance();
    if (!process.env.NOTION_PEOPLE_DATABASE_ID) {
      throw new Error("NOTION_PEOPLE_DATABASE_ID is not set");
    }
    const database = await notion.databases.query({
      database_id: process.env.NOTION_PEOPLE_DATABASE_ID,
    });

    return database.results;
  };

  private getNotionDatabaseProperties = async () => {
    const database = await this.getNotionDatabase();
    const properties = database.map((result: any) => {
      if (result.object === "page" && "properties" in result) {
        return result.properties;
      }
    });
    return properties.filter((property: any) => property !== null);
  };

  public getPeopleData = async () => {
    const properties = await this.getNotionDatabaseProperties();
    const peopleData: PeopleData[] = properties.map((property: any) => {
      return {
        name: NotionUtil.extractName(property.name),
        github: NotionUtil.extractGithub(property.github),
        linkedin: NotionUtil.extractLinkedin(property.linkedin),
      };
    });
    return peopleData;
  };
}

type PeopleData = {
  name: string;
  github: string | null;
  linkedin: string | null;
};

declare module "@shared/utils/SingletonRegistry" {
  interface SingletonRegistry {
    [TOKEN]: NotionManager;
  }
}
