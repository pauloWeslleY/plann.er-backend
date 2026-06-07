import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateTripPort } from "@/application/ports/update-trip.port";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyUpdateTripAdapter {
  constructor(private readonly updateTrip: UpdateTripPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put(
      "/trips",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Trips"],
          description: "Atualiza os dados de uma viagem.",
          body: z.object({
            tripId: z.uuid(),
            destination: z.string().min(4),
            startsAt: z.coerce.date(),
            endsAt: z.coerce.date(),
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
        const result = await this.updateTrip.execute(request.body);
        return reply.status(201).send(result.trip);
      },
    );
  }
}
