import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type ConfirmTripPort } from "@/application/ports/confirm-trip.port";

export class FastifyConfirmTripAdapter {
  constructor(private readonly confirmTrip: ConfirmTripPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/confirm",
      {
        schema: {
          tags: ["Trips"],
          params: z.object({
            tripId: z.uuid(),
          }),
        },
      },
      async (request, reply) => {
        const result = await this.confirmTrip.execute({
          tripId: request.params.tripId,
        });

        return reply.redirect(result.url);
      },
    );
  }
}
