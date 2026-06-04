import { type schema } from "@/resources/database/schemas";

export type ActivityRow = typeof schema.ActivitiesTable.$inferSelect;

export interface CreateActivityDTO {
  id: string;
  title: string;
  occursAt: Date;
  tripId: string;
}

export interface ActivityDTO {
  date: Date;
  activities: ActivityRow[];
}
