import type { FastifyInstance } from "fastify";

import { FastifyUpdateParticipantAdapter } from "@/adapters/input/http/fastify-update-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { UpdateParticipantUseCase } from "@/application/update-participant.use-case";

export async function updateParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const updateParticipantUseCase = new UpdateParticipantUseCase(
    tripRepository,
    participantRepository,
  );
  const httpAdapter = new FastifyUpdateParticipantAdapter(
    updateParticipantUseCase,
  );

  httpAdapter.register(app);
}
