import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type DeleteLinkPort } from "@/application/ports/delete-link.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyDeleteLinkAdapter {
  constructor(private readonly deleteLink: DeleteLinkPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete(
      "/trips/link",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Links"],
          description: "Deletar um link de uma viagem",
          querystring: z.object({
            tripId: z.uuid(),
            linkId: z.uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        await this.deleteLink.execute({
          id: request.query.linkId,
          tripId: request.query.tripId,
        });

        return reply.status(200).send({ message: "Link deleted successfully" });
      },
    );
  }
}
