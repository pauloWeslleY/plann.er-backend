import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { type CreateTripPort } from "@/application/ports/create-trip.port";
import { env } from "@/config/env";
import { authMiddleware } from "@/resources/middleware/auth-middleware";

export class FastifyCreateTripAdapter {
  constructor(private readonly createTrip: CreateTripPort) {}

  register(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/trips",
      {
        preHandler: [authMiddleware],
        schema: {
          tags: ["Trips"],
          body: z.object({
            destination: z.string().min(4),
            startsAt: z.coerce.date(),
            endsAt: z.coerce.date(),
            ownerName: z.string(),
            ownerEmail: z.email(),
            emailsToInvite: z.array(z.email()),
          }),
          response: {
            201: z.object({
              url: z.url(),
              emailSent: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const result = await this.createTrip.execute({
          ...request.body,
          userId: request.session?.user.id,
        });

        return reply.status(201).send({
          url: `${env.WEB_BASE_URL}/trips/${result.tripId}`,
          emailSent: result.emailSent,
        });
      },
    );
  }
}
