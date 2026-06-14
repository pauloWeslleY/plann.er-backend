import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type CreateParticipantPort } from "@/application/ports/create-participant.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyCreateParticipantAdapter {
  constructor(private readonly createParticipant: CreateParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/participant",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Adicionar participantes a uma viagem",
          body: z.object({
            tripId: z.uuid(),
            participants: z.array(
              z.object({
                email: z.email(),
                name: z.string().nullish(),
              }),
            ),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.uuid(),
                email: z.email(),
                name: z.string().nullish(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.createParticipant.execute(request.body);
        return reply.status(200).send(result);
      },
    );
  }
}
