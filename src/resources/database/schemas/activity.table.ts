import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { TripsTable } from "./trip.table";

export const ActivitiesTable = pgTable("activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  occursAt: timestamp("occurs_at").notNull(),
  isDone: boolean("is_done").default(false).notNull(),
  tripId: text("trip_id")
    .notNull()
    .references(() => TripsTable.id, { onDelete: "cascade" }),
});

export const ActivitiesRelations = relations(ActivitiesTable, ({ one }) => ({
  trip: one(TripsTable, {
    fields: [ActivitiesTable.tripId],
    references: [TripsTable.id],
  }),
}));
