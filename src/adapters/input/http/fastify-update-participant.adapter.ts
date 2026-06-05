import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateParticipantPort } from "@/application/ports/update-participant.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyUpdateParticipantAdapter {
  constructor(private readonly updateParticipant: UpdateParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put(
      "/participant",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Atualiza um participante de uma viagem.",
          body: z.object({
            participantId: z.uuid(),
            tripId: z.uuid(),
            email: z.email("Email inválido."),
            name: z.string().nullish(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              tripId: z.string(),
              name: z.string().nullable(),
              email: z.string(),
              isConfirmed: z.boolean(),
              isOwner: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.updateParticipant.execute({
          ...request.body,
          userId: request.session?.user.id,
        });
        return reply.status(200).send(result);
      },
    );
  }
}
