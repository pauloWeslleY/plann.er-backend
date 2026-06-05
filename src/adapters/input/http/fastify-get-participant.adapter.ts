import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetParticipantPort } from "@/application/ports/get-participant.port";

export class FastifyGetParticipantAdapter {
  constructor(private readonly getParticipant: GetParticipantPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/participants/:participantId",
      {
        schema: {
          tags: ["Participants"],
          description: "Detalhar um participante por ID",
          params: z.object({
            participantId: z.uuid(),
          }),
          response: {
            200: z.object({
              id: z.uuid(),
              name: z.string().nullable(),
              email: z.email(),
              isConfirmed: z.boolean(),
              isOwner: z.boolean(),
              tripId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getParticipant.execute({
          participantId: request.params.participantId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
