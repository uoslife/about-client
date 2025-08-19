import { z } from "zod";
import { NotionDatabaseResponseSchema, NotionPageSchema } from "./NotionSchema";

export type NotionPage = z.infer<typeof NotionPageSchema>;
export type NotionDatabaseResponse = z.infer<
  typeof NotionDatabaseResponseSchema
>;

export type PeopleData = {
  name: string;
  github: string | null;
  linkedin: string | null;
};
