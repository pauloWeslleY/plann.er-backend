import z from "zod";

const envSchema = z.object({
  HOST: z.string().default("0.0.0.0"),
  API_BASE_URL: z.url(),
  WEB_BASE_URL: z.url(),
  POSTGRES_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
