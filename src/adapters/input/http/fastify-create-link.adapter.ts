import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type CreateLinkPort } from "@/application/ports/create-link.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyCreateLinkAdapter {
  constructor(private readonly createLink: CreateLinkPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/link",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Links"],
          description: "Adicionar um link a uma viagem",
          params: z.object({
            tripId: z.uuid(),
          }),
          body: z.object({
            title: z.string().min(4),
            url: z.url(),
          }),
          response: {
            201: z.object({
              id: z.uuid(),
              title: z.string().min(4),
              url: z.url(),
              tripId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.createLink.execute({
          ...request.body,
          tripId: request.params.tripId,
        });

        return reply.status(201).send(result);
      },
    );
  }
}
