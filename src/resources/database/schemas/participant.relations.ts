import { relations } from "drizzle-orm";

import { ParticipantsTable } from "./participant.table";
import { ParticipantsTripsTable } from "./participants-trips.table";

export const ParticipantsRelations = relations(
  ParticipantsTable,
  ({ many }) => ({
    trips: many(ParticipantsTripsTable),
  }),
);
