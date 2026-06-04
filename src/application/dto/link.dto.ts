import { type schema } from "@/resources/database/schemas";

export type LinkRow = typeof schema.LinksTable.$inferSelect;

export interface CreateLinkDTO {
  id: string;
  tripId: string;
  title: string;
  url: string;
}

export interface LinkDTO {
  id: string;
  title: string;
  url: string;
}

export interface InputLinkDTO {
  tripId: string;
  title: string;
  url: string;
}
