import { z } from "zod";

export const NotionTitlePropertySchema = z.object({
  type: z.literal("title"),
  title: z
    .array(
      z.object({
        plain_text: z.string(),
      })
    )
    .min(1),
});

export const NotionUrlPropertySchema = z.object({
  type: z.literal("url"),
  url: z.string().url().optional(),
});

export const NotionPagePropertiesSchema = z.object({
  name: NotionTitlePropertySchema,
  github: NotionUrlPropertySchema.optional(),
  linkedin: NotionUrlPropertySchema.optional(),
});

export const NotionPageSchema = z.object({
  object: z.literal("page"),
  properties: NotionPagePropertiesSchema,
});

export const NotionDatabaseResponseSchema = z.object({
  results: z.array(NotionPageSchema),
});
