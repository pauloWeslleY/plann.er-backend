import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateActivityPort } from "@/application/ports/update-activity.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyUpdateActivityAdapter {
  constructor(private readonly updateActivity: UpdateActivityPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put(
      "/trips/:tripId/activity",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Activities"],
          params: z.object({
            tripId: z.uuid(),
          }),
          body: z.object({
            id: z.uuid(),
            title: z.string().min(4),
            occursAt: z.coerce.date(),
          }),
          201: z.object({
            activityId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const result = await this.updateActivity.execute({
          ...request.body,
          tripId: request.params.tripId,
        });

        return reply.status(201).send(result);
      },
    );
  }
}
