import type { FastifyInstance } from "fastify";

import { FastifyConfirmParticipantAdapter } from "@/adapters/input/http/fastify-confirm-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { ConfirmParticipantUseCase } from "@/application/confirm-participant.use-case";

export async function confirmParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const confirmParticipantUseCase = new ConfirmParticipantUseCase(
    tripRepository,
    participantRepository,
  );
  const httpAdapter = new FastifyConfirmParticipantAdapter(
    confirmParticipantUseCase,
  );

  httpAdapter.register(app);
}
