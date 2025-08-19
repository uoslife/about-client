import { z } from "zod";
import {
  NotionDatabaseResponseSchema,
  NotionPageSchema,
  NotionTitlePropertySchema,
  NotionUrlPropertySchema,
} from "./NotionSchema";
import type {
  NotionPage,
  NotionDatabaseResponse,
  PeopleData,
} from "./NotionType";

export class NotionUtil {
  public static extractName = (
    property: z.infer<typeof NotionTitlePropertySchema>
  ): string => {
    return property.title[0].plain_text;
  };

  public static extractGithub = (
    property?: z.infer<typeof NotionUrlPropertySchema>
  ): string | null => {
    return property?.url ?? null;
  };

  public static extractLinkedin = (
    property?: z.infer<typeof NotionUrlPropertySchema>
  ): string | null => {
    return property?.url ?? null;
  };

  public static parseNotionPage = (page: unknown): NotionPage => {
    return NotionPageSchema.parse(page);
  };

  public static parseNotionDatabase = (
    response: unknown
  ): NotionDatabaseResponse => {
    return NotionDatabaseResponseSchema.parse(response);
  };

  public static convertToPeopleData = (page: NotionPage): PeopleData => {
    const { properties } = page;
    return {
      name: NotionUtil.extractName(properties.name),
      github: NotionUtil.extractGithub(properties.github),
      linkedin: NotionUtil.extractLinkedin(properties.linkedin),
    };
  };
}
