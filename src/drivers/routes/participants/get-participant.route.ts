import type { FastifyInstance } from "fastify";

import { FastifyGetParticipantAdapter } from "@/adapters/input/http/fastify-get-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { GetParticipantUseCase } from "@/application/get-participant.use-case";

export async function getParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const getParticipantUseCase = new GetParticipantUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyGetParticipantAdapter(getParticipantUseCase);

  httpAdapter.register(app);
}
