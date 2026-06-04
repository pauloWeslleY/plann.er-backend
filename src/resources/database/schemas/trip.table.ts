import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { UsersTable } from "./auth.table";

export const TripStatusEnum = pgEnum("trip_status", [
  "PLANNED",
  "CONFIRMED",
  "CANCELLED",
]);

export const TripsTable = pgTable("trips", {
  id: text("id").primaryKey(),
  destination: text("destination").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  isConfirmed: boolean("is_confirmed").default(false).notNull(),
  status: TripStatusEnum("status").default("PLANNED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
});
