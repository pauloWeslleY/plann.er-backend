import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type CreateInvitePort } from "@/application/ports/create-invite.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyCreateInviteAdapter {
  constructor(private readonly createInvite: CreateInvitePort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/invites",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Invites"],
          description: "Adicionar um convite a uma viagem",
          params: z.object({
            tripId: z.uuid(),
          }),
          body: z.object({
            email: z.email(),
          }),
          201: z.object({
            activityId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const result = await this.createInvite.execute({
          ...request.body,
          tripId: request.params.tripId,
        });

        return reply.status(201).send(result);
      },
    );
  }
}
