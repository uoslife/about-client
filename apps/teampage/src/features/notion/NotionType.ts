import { z } from "zod";
import { NotionListResponseSchema, NotionPageSchema } from "./NotionSchema";

export type NotionPage = z.infer<typeof NotionPageSchema>;
export type NotionListResponse = z.infer<typeof NotionListResponseSchema>;

export const NOTION_POSITION = {
  PM: "Product Manager",
  MARKETING: "Marketer",
  DESIGN: "Designer",
  DEV: "Developer",
  LEAD: "Leader",
  SUB: "Subleader",
} as const;

export type PositionType =
  (typeof NOTION_POSITION)[keyof typeof NOTION_POSITION];

export type PositionKeyType = keyof typeof NOTION_POSITION;

export type GenerationType = `${number}기`;

export type PeopleData = {
  name: string;
  generation: GenerationType;
  position: PositionType;
  career?: string;
  major: string;
  link_others?: string;
  image_profile?: string;
  summary?: string;
};
