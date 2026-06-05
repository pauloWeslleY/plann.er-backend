import z from "zod";

const envSchema = z.object({
  API_BASE_URL: z.url(),
  WEB_BASE_URL: z.url(),
  POSTGRES_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
