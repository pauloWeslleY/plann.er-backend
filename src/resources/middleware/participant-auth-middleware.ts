import { type FastifyReply, type FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { DrizzleParticipantTokenRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-token-repository.adapter";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/resources/errors/app-error";

// type ParticipantTokenPayload = JwtPayload & {
//   sub: string;
//   email: string;
//   type: "participant";
// };

export async function participantAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return reply.status(401).send({
      message: "Token não informado.",
    });
  }

  const token = authorization.replace("Bearer ", "");
  const participantTokenRepository =
    new DrizzleParticipantTokenRepositoryAdapter();

  try {
    const isRevoked = await participantTokenRepository.isRevoked(token);

    if (isRevoked) {
      throw new UnauthorizedError("Token revogado.");
    }

    const payload = jwt.verify(token, env.PARTICIPANT_JWT_SECRET);

    if (
      typeof payload === "string" ||
      payload.type !== "participant" ||
      !payload.sub ||
      !payload.email
    ) {
      throw new UnauthorizedError("Token inválido.");
    }

    request.participant = {
      id: payload.sub,
      email: payload.email,
    };
  } catch {
    return reply.status(401).send({
      message: "Token inválido ou expirado.",
    });
  }
}
