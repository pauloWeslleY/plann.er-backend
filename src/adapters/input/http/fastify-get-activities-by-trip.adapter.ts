import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type GetActivitiesByTripPort } from "@/application/ports/get-activities-by-trip.port";

export class FastifyGetActivitiesByTripAdapter {
  constructor(private readonly getActivitiesByTrip: GetActivitiesByTripPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/activities",
      {
        schema: {
          tags: ["Activities"],
          description: "Listar todas as atividades de uma viagem específica",
          querystring: z.object({
            tripId: z.uuid(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                occursAt: z.date(),
                isDone: z.boolean(),
                tripId: z.uuid(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getActivitiesByTrip.execute({
          tripId: request.query.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
