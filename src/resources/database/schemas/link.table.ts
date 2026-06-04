import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { TripsTable } from "./trip.table";

export const LinksTable = pgTable("links", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  tripId: text("trip_id")
    .notNull()
    .references(() => TripsTable.id, { onDelete: "cascade" }),
});

export const LinksRelations = relations(LinksTable, ({ one }) => ({
  trip: one(TripsTable, {
    fields: [LinksTable.tripId],
    references: [TripsTable.id],
  }),
}));
