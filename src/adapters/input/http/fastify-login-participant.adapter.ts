import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import type { LoginParticipantPort } from "@/application/ports/login-participant.port";

export class FastifyLoginParticipantAdapter {
  constructor(private readonly loginParticipant: LoginParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/participants/auth/login",
      {
        schema: {
          tags: ["Participants"],
          description: "Gerar JWT para login do participante",
          body: z.object({
            email: z.email(),
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
        const result = await this.loginParticipant.execute(request.body);
        return reply.status(200).send(result);
      },
    );
  }
}
