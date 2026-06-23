import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/resources/errors/app-error";

import type { LogoutParticipantPort } from "./ports/logout-participant.port";
import type { ParticipantTokenRepositoryPort } from "./ports/participant-token-repository.port";

type ParticipantTokenPayload = JwtPayload & {
  sub: string;
  email: string;
  type: "participant" | "participant_refresh";
};

export class LogoutParticipantUseCase implements LogoutParticipantPort {
  constructor(
    private readonly participantTokenRepository: ParticipantTokenRepositoryPort,
  ) {}

  async execute(input: {
    token?: string;
    refreshToken?: string;
  }): Promise<void> {
    if (!input.token?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token não informado.");
    }

    const acessToken = input.token.replace("Bearer ", "");
    const tokenPayload = this.verifyToken(acessToken, "participant");

    await this.participantTokenRepository.revoke({
      token: acessToken,
      expiresAt: this.getExpirationDate(tokenPayload),
    });

    if (!input.refreshToken) {
      throw new BadRequestError("Refresh token não informado.");
    }

    const refreshPayload = this.verifyToken(
      input.refreshToken,
      "participant_refresh",
    );

    if (refreshPayload.sub !== tokenPayload.sub) {
      throw new UnauthorizedError("Refresh token inválido.");
    }

    await this.participantTokenRepository.revoke({
      token: input.refreshToken,
      expiresAt: this.getExpirationDate(refreshPayload),
    });
  }

  private verifyToken(
    token: string,
    type: ParticipantTokenPayload["type"],
  ): ParticipantTokenPayload {
    try {
      const payload = jwt.verify(token, env.PARTICIPANT_JWT_SECRET);

      if (
        typeof payload === "string" ||
        payload.type !== type ||
        !payload.sub ||
        !payload.email
      ) {
        throw new UnauthorizedError("Token inválido.");
      }

      return payload as ParticipantTokenPayload;
    } catch {
      throw new UnauthorizedError("Token inválido.");
    }
  }

  private getExpirationDate(payload: ParticipantTokenPayload): Date {
    if (!payload.exp) {
      throw new UnauthorizedError("Token inválido.");
    }

    return new Date(payload.exp * 1000);
  }
}
