import postgres from "postgres";

import { env } from "@/config/env";

export const sql = postgres(env.POSTGRES_URL);
