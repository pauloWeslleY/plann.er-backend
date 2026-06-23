import { type FastifyInstance } from "fastify";

import { FastifyLoginParticipantAdapter } from "@/adapters/input/http/fastify-login-participant.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { LoginParticipantUseCase } from "@/application/login-participant.use-case";

export async function loginParticipantRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const loginParticipantUseCase = new LoginParticipantUseCase(
    participantRepository,
  );
  const httpAdapter = new FastifyLoginParticipantAdapter(
    loginParticipantUseCase,
  );

  httpAdapter.register(app);
}
