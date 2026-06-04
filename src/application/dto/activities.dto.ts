import { type schema } from "@/resources/database/schemas";

import { type TripRow } from "./trip.dto";

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

export interface ActivitiesByTripIdDTO {
  id: string;
  title: string;
  occursAt: Date;
  trip: TripRow;
}
