import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type GetActivitiesPort } from "@/application/ports/get-activities.port";

export class FastifyGetActivitiesAdapter {
  constructor(private readonly getActivities: GetActivitiesPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/activities",
      {
        schema: {
          tags: ["Activities"],
          description: "Listar todas as atividades de uma viagem específica",
          params: z.object({
            tripId: z.uuid(),
          }),
          response: {
            200: z.array(
              z.object({
                date: z.date(),
                activities: z.array(
                  z.object({
                    id: z.uuid(),
                    title: z.string(),
                    occursAt: z.date(),
                    isDone: z.boolean(),
                    tripId: z.uuid(),
                  }),
                ),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getActivities.execute({
          tripId: request.params.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
