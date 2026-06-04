import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetTripDetailsPort } from "@/application/ports/get-trip-details.port";

export class FastifyGetTripDetailsAdapter {
  constructor(private readonly getTripDetails: GetTripDetailsPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId",
      {
        schema: {
          tags: ["Trips"],
          params: z.object({
            tripId: z.uuid(),
          }),
          response: {
            200: z.object({
              id: z.uuid(),
              destination: z.string(),
              startsAt: z.date(),
              endsAt: z.date(),
              isConfirmed: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getTripDetails.execute({
          tripId: request.params.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
