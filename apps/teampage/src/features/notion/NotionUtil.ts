import { z } from 'zod';
import {
  NotionListResponseSchema,
  NotionListEnvelopeSchema,
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
  RowFailure,
} from './NotionType';

export class NotionUtil {
  public static parseNotionPage = (page: unknown): NotionPage => {
    return NotionPageSchema.parse(page);
  };

  public static parseNotionList = (response: unknown): NotionListResponse => {
    return NotionListResponseSchema.parse(response);
  };

  public static parseNotionListSafe = (response: unknown) => {
    const envelope = NotionListEnvelopeSchema.parse(response);

    const valid: NotionPage[] = [];
    const failures: RowFailure[] = [];

    envelope.results.forEach((row, index) => {
      const result = NotionPageSchema.safeParse(row);
      if (result.success) {
        valid.push(result.data);
      } else {
        failures.push({
          index,
          name: NotionUtil.peekName(row),
          issues: result.error.issues.map(
            (i) => `${i.path.join('.')}: ${i.message}`,
          ),
        });
      }
    });

    return { valid, failures };
  };

  private static peekName = (row: unknown): string | undefined => {
    const r = z
      .object({
        properties: z.object({
          name: z.object({
            title: z.array(z.object({ plain_text: z.string() })).min(1),
          }),
        }),
      })
      .safeParse(row);
    return r.success ? r.data.properties.name.title[0].plain_text : undefined;
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
    if (!property?.files?.[0]?.file?.url) return undefined;

    const fileUrl = property.files[0].file.url;
    const fileName = property.files[0].name || '';

    if (fileName.toLowerCase().includes('.heic')) {
      return undefined;
    }

    return fileUrl;
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
      link_others: NotionUtil.extractLink(properties.link_others),
      link_github: NotionUtil.extractLink(properties.link_github),
      link_linkedin: NotionUtil.extractLink(properties.link_linkedin),
    };
  };
}
