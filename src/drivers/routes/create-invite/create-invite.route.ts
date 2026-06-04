import type { FastifyInstance } from "fastify";

import { FastifyCreateInviteAdapter } from "@/adapters/input/http/fastify-create-invite.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateInviteUseCase } from "@/application/create-invite.use-case";
import { dateJS } from "@/resources/date-js/datejs";
import { getMailClient } from "@/resources/mail-client/mail-client";

export async function createInviteRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const createInviteUseCase = new CreateInviteUseCase(
    tripRepository,
    participantRepository,
    {
      date: { dayjs: dateJS },
      mailClient: await getMailClient(),
    },
  );

  const httpAdapter = new FastifyCreateInviteAdapter(createInviteUseCase);

  httpAdapter.register(app);
}
