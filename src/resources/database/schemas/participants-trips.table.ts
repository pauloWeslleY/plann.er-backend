import { relations } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { ParticipantsTable } from "./participant.table";
import { TripsTable } from "./trip.table";

export const ParticipantsTripsTable = pgTable(
  "participants_trips",
  {
    participantId: text("participant_id")
      .notNull()
      .references(() => ParticipantsTable.id, { onDelete: "cascade" }),
    tripId: text("trip_id")
      .notNull()
      .references(() => TripsTable.id, { onDelete: "cascade" }),
    isConfirmed: boolean("is_confirmed").default(false).notNull(),
    isOwner: boolean("is_owner").default(false).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.participantId, table.tripId],
    }),
  ],
);

export const ParticipantsTripsRelations = relations(
  ParticipantsTripsTable,
  ({ one }) => ({
    participant: one(ParticipantsTable, {
      fields: [ParticipantsTripsTable.participantId],
      references: [ParticipantsTable.id],
    }),
    trip: one(TripsTable, {
      fields: [ParticipantsTripsTable.tripId],
      references: [TripsTable.id],
    }),
  }),
);
