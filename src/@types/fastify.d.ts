import "fastify";

import { type auth } from "@/resources/auth/auth";

declare module "fastify" {
  export interface FastifyRequest {
    session?: Awaited<ReturnType<typeof auth.api.getSession>> | null;
  }
}
