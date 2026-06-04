import { relations } from "drizzle-orm";

import { ActivitiesTable } from "./activity.table";
import { LinksTable } from "./link.table";
import { ParticipantsTripsTable } from "./participants-trips.table";
import { TripsTable } from "./trip.table";

export const TripsRelations = relations(TripsTable, ({ many }) => ({
  activities: many(ActivitiesTable),
  links: many(LinksTable),
  participants: many(ParticipantsTripsTable),
}));
