import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import type { LogoutParticipantPort } from "@/application/ports/logout-participant.port";
import { participantAuthMiddleware } from "@/resources/middleware/participant-auth-middleware";

export class FastifyLogoutParticipantAdapter {
  constructor(private readonly logoutParticipant: LogoutParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/participants/auth/logout",
      {
        preHandler: [participantAuthMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Revogar JWT de login do participante",
          body: z
            .object({
              refreshToken: z.string().optional(),
            })
            .optional(),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        await this.logoutParticipant.execute({
          token: request.headers.authorization,
          refreshToken: request.body?.refreshToken,
        });

        return reply.status(200).send({
          message: "Participante deslogado com sucesso.",
        });
      },
    );
  }
}
