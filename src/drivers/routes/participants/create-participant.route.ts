import type { FastifyInstance } from "fastify";

import { FastifyCreateParticipantAdapter } from "@/adapters/input/http/fastify-create-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { CreateParticipantUseCase } from "@/application/create-participant.use-case";

export async function createParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const createParticipantUseCase = new CreateParticipantUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyCreateParticipantAdapter(
    createParticipantUseCase,
  );

  httpAdapter.register(app);
}
