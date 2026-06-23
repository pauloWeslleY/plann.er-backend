import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";
import { UnauthorizedError } from "@/resources/errors/app-error";

import { type IParticipant } from "./dto/participant.dto";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";
import type { ParticipantTokenRepositoryPort } from "./ports/participant-token-repository.port";
import type { RefreshParticipantTokenPort } from "./ports/refresh-participant-token.port";

type ParticipantRefreshTokenPayload = JwtPayload & {
  sub: string;
  email: string;
  type: "participant_refresh";
};

export class RefreshParticipantTokenUseCase implements RefreshParticipantTokenPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
    private readonly participantTokenRepository: ParticipantTokenRepositoryPort,
  ) {}

  async execute(input: { refreshToken: string }): Promise<{
    token: string;
    refreshToken: string;
    participant: IParticipant;
  }> {
    const payload = this.verifyRefreshToken(input.refreshToken);
    const isRevoked = await this.participantTokenRepository.isRevoked(
      input.refreshToken,
    );

    if (isRevoked) {
      throw new UnauthorizedError("Refresh token inválido.");
    }

    const participant = await this.participantRepository.findByEmail(
      payload.email,
    );

    if (!participant || participant.id !== payload.sub) {
      throw new UnauthorizedError("Refresh token inválido.");
    }

    const token = jwt.sign(
      {
        sub: participant.id,
        email: participant.email,
        type: "participant",
      },
      env.PARTICIPANT_JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        sub: participant.id,
        email: participant.email,
        type: "participant_refresh",
      },
      env.PARTICIPANT_JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      refreshToken,
      participant,
    };
  }

  private verifyRefreshToken(token: string): ParticipantRefreshTokenPayload {
    try {
      const payload = jwt.verify(token, env.PARTICIPANT_JWT_SECRET);

      if (
        typeof payload === "string" ||
        payload.type !== "participant_refresh" ||
        !payload.sub ||
        !payload.email
      ) {
        throw new UnauthorizedError("Refresh token inválido.");
      }

      return payload as ParticipantRefreshTokenPayload;
    } catch {
      throw new UnauthorizedError("Refresh token inválido.");
    }
  }
}
