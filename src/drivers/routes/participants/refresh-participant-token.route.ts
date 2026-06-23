import { type FastifyInstance } from "fastify";

import { FastifyRefreshParticipantTokenAdapter } from "@/adapters/input/http/fastify-refresh-participant-token.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { DrizzleParticipantTokenRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-token-repository.adapter";
import { RefreshParticipantTokenUseCase } from "@/application/refresh-participant-token.use-case";

export async function refreshParticipantTokenRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const participantTokenRepository =
    new DrizzleParticipantTokenRepositoryAdapter();
  const refreshParticipantTokenUseCase = new RefreshParticipantTokenUseCase(
    participantRepository,
    participantTokenRepository,
  );
  const httpAdapter = new FastifyRefreshParticipantTokenAdapter(
    refreshParticipantTokenUseCase,
  );

  httpAdapter.register(app);
}
