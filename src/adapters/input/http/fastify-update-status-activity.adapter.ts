import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateStatusActivityPort } from "@/application/ports/update-status-activity.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyUpdateStatusActivityAdapter {
  constructor(
    private readonly updateStatusActivity: UpdateStatusActivityPort,
  ) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put(
      "/activities/status",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Activities"],
          description: "Atualiza o status de uma atividade.",
          body: z.object({
            id: z.string(),
            tripId: z.uuid(),
            isDone: z.boolean(),
          }),
          response: {
            201: z.object({
              id: z.uuid(),
              title: z.string(),
              occursAt: z.date(),
              isDone: z.boolean(),
              tripId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.updateStatusActivity.execute(request.body);
        return reply.status(201).send(result);
      },
    );
  }
}
