import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ParticipantRevokedTokensTable = pgTable(
  "participant_revoked_tokens",
  {
    token: text("token").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);
