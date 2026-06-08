import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type GetTripsByOwnerPort } from "@/application/ports/get-trips-by-owner.port";

export class FastifyGetTripsByOwnerAdapter {
  constructor(private readonly getTripsByOwner: GetTripsByOwnerPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/user/:userId",
      {
        schema: {
          tags: ["Trips"],
          description: "Lista as viagens de um usuário.",
          params: z.object({
            userId: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.uuid(),
                destination: z.string(),
                startsAt: z.date(),
                endsAt: z.date(),
                userId: z.string(),
                status: z.enum(["PLANNED", "CANCELLED", "CONFIRMED"]),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
                totalParticipants: z.number(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const result = await this.getTripsByOwner.execute({
          userId: request.params.userId,
        });

        return reply.status(200).send(result);
      },
    );
  }
}
