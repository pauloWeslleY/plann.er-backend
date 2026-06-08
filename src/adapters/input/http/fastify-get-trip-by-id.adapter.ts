import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetTripByIdPort } from "@/application/ports/get-trip-by-id.port";

export class FastifyGetTripByIdAdapter {
  constructor(private readonly getTripById: GetTripByIdPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/details",
      {
        schema: {
          tags: ["Trips"],
          description: "Detalhes completos de uma viagem específica.",
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
              status: z.enum(["PLANNED", "CONFIRMED", "CANCELLED"]),
              userId: z.string(),
              totalParticipants: z.number(),
              totalLinks: z.number(),
              totalActivities: z.number(),
              owner: z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                email: z.email(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getTripById.execute({
          tripId: request.params.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
