import { z } from 'zod';

export const NotionTitlePropertySchema = z.object({
  type: z.literal('title'),
  title: z
    .array(
      z.object({
        plain_text: z.string(),
      }),
    )
    .min(1),
});

export const NotionRichTextPropertySchema = z.object({
  type: z.literal('rich_text'),
  rich_text: z.array(
    z.object({
      plain_text: z.string(),
    }),
  ),
});

export const NotionSelectPropertySchema = z.object({
  type: z.literal('select'),
  select: z.object({
    name: z.string(),
  }),
});

export const NotionUrlPropertySchema = z.object({
  type: z.literal('url'),
  url: z.string().nullable(),
});

export const NotionFilesPropertySchema = z.object({
  type: z.literal('files'),
  files: z.array(z.any()),
});

export const OptionalNotionRichTextPropertySchema =
  NotionRichTextPropertySchema.optional();

export const OptionalNotionUrlPropertySchema =
  NotionUrlPropertySchema.optional();

export const OptionalNotionFilesPropertySchema =
  NotionFilesPropertySchema.optional();

export const NotionPagePropertiesSchema = z.object({
  name: NotionTitlePropertySchema,
  generation: NotionRichTextPropertySchema,
  position: NotionSelectPropertySchema,
  career: OptionalNotionRichTextPropertySchema,
  major: NotionRichTextPropertySchema,
  image_profile: OptionalNotionFilesPropertySchema,
  summary: OptionalNotionRichTextPropertySchema,
  link_github: OptionalNotionUrlPropertySchema,
  link_others: OptionalNotionUrlPropertySchema,
  link_linkedin: OptionalNotionUrlPropertySchema,
});

export const NotionPageSchema = z.object({
  object: z.literal('page'),
  properties: NotionPagePropertiesSchema,
});

export const NotionListResponseSchema = z.object({
  object: z.literal('list'),
  results: z.array(NotionPageSchema),
});
