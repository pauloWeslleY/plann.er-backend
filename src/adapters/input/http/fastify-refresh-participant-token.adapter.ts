import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import type { RefreshParticipantTokenPort } from "@/application/ports/refresh-participant-token.port";

export class FastifyRefreshParticipantTokenAdapter {
  constructor(
    private readonly refreshParticipantToken: RefreshParticipantTokenPort,
  ) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/participants/auth/refresh-token",
      {
        schema: {
          tags: ["Participants"],
          description: "Renovar JWT de login do participante",
          body: z.object({
            refreshToken: z.string(),
          }),
          response: {
            200: z.object({
              token: z.string(),
              refreshToken: z.string(),
              participant: z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                email: z.email(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.refreshParticipantToken.execute(request.body);
        return reply.status(200).send(result);
      },
    );
  }
}
