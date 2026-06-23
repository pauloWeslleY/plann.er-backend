import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetParticipantByTripsPort } from "@/application/ports/get-participant-by-trips.port";
import { participantAuthMiddleware } from "@/resources/middleware/participant-auth-middleware";

export class FastifyGetParticipantByTripsAdapter {
  constructor(
    private readonly getParticipantByTrips: GetParticipantByTripsPort,
  ) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/participant/trips/:participantId",
      {
        preHandler: [participantAuthMiddleware],
        schema: {
          tags: ["Participants"],
          description: "Listar viagens de um participante por ID",
          params: z.object({
            participantId: z.uuid(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.uuid(),
                destination: z.string(),
                startsAt: z.date(),
                endsAt: z.date(),
                status: z.enum(["PLANNED", "CONFIRMED", "CANCELLED"]),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getParticipantByTrips.execute({
          participantId: request.params.participantId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
