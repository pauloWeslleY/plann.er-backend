import type { FastifyInstance } from "fastify";

import { FastifyCreateInviteAdapter } from "@/adapters/input/http/fastify-create-invite.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateInviteUseCase } from "@/application/create-invite.use-case";
import { DateService } from "@/resources/date-js/datejs";
import { EmailClient } from "@/resources/mail-client/mail-client";

export async function createInviteRoute(app: FastifyInstance) {
  const createInviteUseCase = new CreateInviteUseCase({
    participantRepository: new DrizzleParticipantRepositoryAdapter(),
    tripRepository: new DrizzleTripRepositoryAdapter(),
    date: new DateService(),
    mail: new EmailClient(),
  });

  const httpAdapter = new FastifyCreateInviteAdapter(createInviteUseCase);
  httpAdapter.register(app);
}
