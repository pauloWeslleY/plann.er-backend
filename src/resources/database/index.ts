import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";

import { sql } from "./postgres";
import { schema } from "./schemas";

export const database = drizzle({
  client: sql,
  schema,
});

export type Database = typeof database;
