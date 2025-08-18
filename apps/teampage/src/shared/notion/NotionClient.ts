import { Client } from "@notionhq/client";
import { SingletonRegister } from "@shared/utils/SingletonRegistry";

const TOKEN = "NOTION_CLIENT";
@SingletonRegister(TOKEN)
export class NotionClient {
  public static TOKEN = TOKEN;
  private instance: Client | null = null;

  constructor() {
    this.initialize();
  }

  public getInstance(): Client {
    if (!this.instance) {
      throw new Error("Notion client failed to initialize");
    }
    return this.instance;
  }

  private initialize(): void {
    if (!process.env.NOTION_API_KEY) {
      throw new Error("NOTION_API_KEY is not set in environment variables");
    }
    this.instance = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }
}

declare module "@shared/utils/SingletonRegistry" {
  interface SingletonRegistry {
    [TOKEN]: NotionClient;
  }
}
