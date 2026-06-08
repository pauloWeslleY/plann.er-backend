import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateStatusTripPort } from "@/application/ports/update-status-trip.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyUpdateStatusTripAdapter {
  constructor(private readonly updateStatusTrip: UpdateStatusTripPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put(
      "/trips/status",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Trips"],
          description: "Atualiza o status de uma viagem.",
          body: z.object({
            tripId: z.uuid(),
            status: z.enum(["PLANNED", "CONFIRMED", "CANCELLED"]),
          }),
          response: {
            201: z.object({
              id: z.string(),
              destination: z.string(),
              startsAt: z.date(),
              endsAt: z.date(),
              isConfirmed: z.boolean(),
              status: z.enum(["PLANNED", "CONFIRMED", "CANCELLED"]),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.updateStatusTrip.execute(request.body);
        return reply.status(201).send(result);
      },
    );
  }
}
