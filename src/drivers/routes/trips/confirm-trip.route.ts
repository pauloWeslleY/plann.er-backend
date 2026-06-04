import type { FastifyInstance } from "fastify";

import { FastifyConfirmTripAdapter } from "@/adapters/input/http/fastify-confirm-trip.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { ConfirmTripUseCase } from "@/application/confirm-trip.use-case";
import { dateJS } from "@/resources/date-js/datejs";
import { getMailClient } from "@/resources/mail-client/mail-client";

export async function confirmTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const participantRepository = new DrizzleParticipantRepositoryAdapter();

  const confirmTripUseCase = new ConfirmTripUseCase(
    participantRepository,
    tripRepository,
    {
      date: { dayjs: dateJS },
      mailClient: await getMailClient(),
    },
  );
  const httpAdapter = new FastifyConfirmTripAdapter(confirmTripUseCase);

  httpAdapter.register(app);
}
