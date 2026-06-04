import type { FastifyInstance } from "fastify";

import { FastifyDeleteParticipantAdapter } from "@/adapters/input/http/fastify-delete-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { DeleteParticipantUseCase } from "@/application/delete-participant.use-case";

export async function deleteParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const deleteParticipantUseCase = new DeleteParticipantUseCase(
    tripRepository,
    participantRepository,
  );
  const httpAdapter = new FastifyDeleteParticipantAdapter(
    deleteParticipantUseCase,
  );

  httpAdapter.register(app);
}
