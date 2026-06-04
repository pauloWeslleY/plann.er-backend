import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetParticipantsByTripPort } from "@/application/ports/get-participants-by-trip.port";

export class FastifyGetParticipantsByTripAdapter {
  constructor(
    private readonly getParticipantsByTrip: GetParticipantsByTripPort,
  ) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/participants",
      {
        schema: {
          tags: ["Trips"],
          params: z.object({
            tripId: z.uuid(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                email: z.email(),
                isConfirmed: z.boolean(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getParticipantsByTrip.execute({
          tripId: request.params.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
