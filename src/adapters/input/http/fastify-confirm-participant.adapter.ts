import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type ConfirmParticipantPort } from "@/application/ports/confirm-participant.port";
import { env } from "@/config/env";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyConfirmParticipantAdapter {
  constructor(private readonly confirmParticipant: ConfirmParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch(
      "/participants/:participantId/confirm",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Confirmar a presença de um participante em uma viagem",
          params: z.object({
            participantId: z.uuid(),
          }),
          querystring: z.object({
            tripId: z.uuid(),
          }),
        },
      },
      async (request, reply) => {
        const result = await this.confirmParticipant.execute({
          participantId: request.params.participantId,
          tripId: request.query.tripId,
        });

        return reply.redirect(`${env.WEB_BASE_URL}/trips/${result.tripId}`);
      },
    );
  }
}
