import type { FastifyInstance } from "fastify";

import { FastifyConfirmParticipantAdapter } from "@/adapters/input/http/fastify-confirm-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { ConfirmParticipantUseCase } from "@/application/confirm-participant.use-case";

export async function confirmParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const confirmParticipantUseCase = new ConfirmParticipantUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyConfirmParticipantAdapter(
    confirmParticipantUseCase,
  );

  httpAdapter.register(app);
}
