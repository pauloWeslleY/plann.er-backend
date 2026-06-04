import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "../../config/env";
import { database } from "../database";

const FIVE_MINUTES = 5;
const ONE_HOUR = 60;

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_BASE_URL || "http://localhost:5173"],
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    },
  },
  user: {
    modelName: "UsersTable",
    changeEmail: {
      enabled: true,
    },
  },
  session: {
    modelName: "SessionsTable",
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MINUTES * ONE_HOUR,
    },
  },
  account: {
    modelName: "AccountsTable",
  },
  verification: {
    modelName: "VerificationsTable",
  },
});
