import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type CreateActivityPort } from "@/application/ports/create-activity.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyCreateActivityAdapter {
  constructor(private readonly createActivity: CreateActivityPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/activity",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Activities"],
          description: "Adicionar uma nova atividade a uma viagem",
          params: z.object({
            tripId: z.uuid(),
          }),
          body: z.object({
            title: z.string().min(4),
            occursAt: z.coerce.date(),
          }),
          201: z.object({
            activityId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const result = await this.createActivity.execute({
          ...request.body,
          tripId: request.params.tripId,
        });

        return reply.status(201).send(result);
      },
    );
  }
}
