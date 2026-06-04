import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type GetActivitiesPort } from "@/application/ports/get-activities.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyGetActivitiesAdapter {
  constructor(private readonly getActivities: GetActivitiesPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/activities",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Activities"],
          params: z.object({
            tripId: z.uuid(),
          }),
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              occursAt: z.coerce.date(),
            }),
          ),
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
