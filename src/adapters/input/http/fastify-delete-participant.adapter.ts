import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type DeleteParticipantPort } from "@/application/ports/delete-participant.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyDeleteParticipantAdapter {
  constructor(private readonly deleteParticipant: DeleteParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete(
      "/participant",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Deletar um participante de uma viagem",
          querystring: z.object({
            tripId: z.uuid(),
            participantId: z.uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        await this.deleteParticipant.execute(request.query);
        return reply
          .status(200)
          .send({ message: "Participant deleted successfully" });
      },
    );
  }
}
