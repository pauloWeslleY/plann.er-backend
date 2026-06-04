import type { FastifyInstance } from "fastify";

import { FastifyGetParticipantsByTripAdapter } from "@/adapters/input/http/fastify-get-participants-by-trip.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { GetParticipantsByTripUseCase } from "@/application/get-participants-by-trip.use-case";

export async function getParticipantsByTripRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const getParticipantsByTripUseCase = new GetParticipantsByTripUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyGetParticipantsByTripAdapter(
    getParticipantsByTripUseCase,
  );

  httpAdapter.register(app);
}
