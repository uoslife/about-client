import { z } from 'zod';
import {
  NotionListResponseSchema,
  NotionPageSchema,
  OptionalNotionRichTextPropertySchema,
  OptionalNotionFilesPropertySchema,
  NotionRichTextPropertySchema,
  NotionSelectPropertySchema,
  NotionTitlePropertySchema,
  OptionalNotionUrlPropertySchema,
} from './NotionSchema';
import type {
  NotionPage,
  PeopleData,
  GenerationType,
  NotionListResponse,
  PositionType,
} from './NotionType';

export class NotionUtil {
  public static parseNotionPage = (page: unknown): NotionPage => {
    return NotionPageSchema.parse(page);
  };

  public static parseNotionList = (response: unknown): NotionListResponse => {
    return NotionListResponseSchema.parse(response);
  };

  public static extractName = (
    property: z.infer<typeof NotionTitlePropertySchema>,
  ): string => {
    return property.title[0].plain_text;
  };

  public static extractGeneration = (
    property: z.infer<typeof NotionRichTextPropertySchema>,
  ): GenerationType => {
    const text = property.rich_text[0]?.plain_text;
    if (!text || !/^\d+기$/.test(text)) {
      throw new Error('Invalid generation format');
    }
    return text as GenerationType;
  };

  public static extractPosition = (
    property: z.infer<typeof NotionSelectPropertySchema>,
  ): PositionType => {
    return property.select.name as PositionType;
  };

  public static extractCareer = (
    property?: z.infer<typeof OptionalNotionRichTextPropertySchema>,
  ): string | undefined => {
    return property?.rich_text?.[0]?.plain_text;
  };

  public static extractMajor = (
    property: z.infer<typeof NotionRichTextPropertySchema>,
  ): string => {
    return property.rich_text[0]?.plain_text ?? '';
  };

  public static extractLink = (
    property?: z.infer<typeof OptionalNotionUrlPropertySchema>,
  ): string | undefined => {
    return property?.url ?? undefined;
  };

  public static extractImageProfile = (
    property?: z.infer<typeof OptionalNotionFilesPropertySchema>,
  ): string | undefined => {
    return property?.files?.[0]?.file?.url ?? undefined;
  };

  public static extractSummary = (
    property?: z.infer<typeof OptionalNotionRichTextPropertySchema>,
  ): string | undefined => {
    return property?.rich_text?.[0]?.plain_text;
  };

  public static convertToPeopleData = (page: NotionPage): PeopleData => {
    const { properties } = page;
    return {
      name: NotionUtil.extractName(properties.name),
      generation: NotionUtil.extractGeneration(properties.generation),
      position: NotionUtil.extractPosition(properties.position),
      career: NotionUtil.extractCareer(properties.career),
      major: NotionUtil.extractMajor(properties.major),
      image_profile: NotionUtil.extractImageProfile(properties.image_profile),
      summary: NotionUtil.extractSummary(properties.summary),
      blog: NotionUtil.extractLink(properties.blog),
      github: NotionUtil.extractLink(properties.github),
      linkedin: NotionUtil.extractLink(properties.linkedin),
    };
  };
}
