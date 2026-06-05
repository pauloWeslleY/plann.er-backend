import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type UpdateTripPort } from "@/application/ports/update-trip.port";
import { env } from "@/config/env";
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
        },
      },
      async (request, reply) => {
        const result = await this.updateTrip.execute(request.body);
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${result.tripId}`);
      },
    );
  }
}
