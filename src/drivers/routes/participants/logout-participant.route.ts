import { type FastifyInstance } from "fastify";

import { FastifyLogoutParticipantAdapter } from "@/adapters/input/http/fastify-logout-participant.adapter";
import { DrizzleParticipantTokenRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-token-repository.adapter";
import { LogoutParticipantUseCase } from "@/application/logout-participant.use-case";

export async function logoutParticipantRoute(app: FastifyInstance) {
  const participantTokenRepository =
    new DrizzleParticipantTokenRepositoryAdapter();
  const logoutParticipantUseCase = new LogoutParticipantUseCase(
    participantTokenRepository,
  );
  const httpAdapter = new FastifyLogoutParticipantAdapter(
    logoutParticipantUseCase,
  );

  httpAdapter.register(app);
}
