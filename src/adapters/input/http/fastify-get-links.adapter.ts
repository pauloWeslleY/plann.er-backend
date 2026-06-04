import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { type GetLinksPort } from "@/application/ports/get-links.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyGetLinksAdapter {
  constructor(private readonly getLinks: GetLinksPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/links",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Links"],
          params: z.object({
            tripId: z.uuid(),
          }),
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              url: z.url(),
            }),
          ),
        },
      },
      async (request, reply) => {
        const result = await this.getLinks.execute({
          tripId: request.params.tripId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
