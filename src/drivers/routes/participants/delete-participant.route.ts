import type { FastifyInstance } from "fastify";

import { FastifyDeleteParticipantAdapter } from "@/adapters/input/http/fastify-delete-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DeleteParticipantUseCase } from "@/application/delete-participant.use-case";

export async function deleteParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const deleteParticipantUseCase = new DeleteParticipantUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyDeleteParticipantAdapter(
    deleteParticipantUseCase,
  );

  httpAdapter.register(app);
}
