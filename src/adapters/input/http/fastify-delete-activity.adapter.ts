import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type DeleteActivityPort } from "@/application/ports/delete-activity.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyDeleteActivityAdapter {
  constructor(private readonly deleteActivity: DeleteActivityPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete(
      "/trips/activity",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Activities"],
          querystring: z.object({
            tripId: z.uuid(),
            activityId: z.uuid(),
          }),
          200: z.object({
            message: z.string(),
          }),
        },
      },
      async (request, reply) => {
        await this.deleteActivity.execute({
          id: request.query.activityId,
          tripId: request.query.tripId,
        });

        return reply
          .status(200)
          .send({ message: "Activity deleted successfully" });
      },
    );
  }
}
