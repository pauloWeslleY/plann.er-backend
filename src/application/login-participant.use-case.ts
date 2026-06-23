import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import { NotFoundError } from "@/resources/errors/app-error";

import { type IParticipant } from "./dto/participant.dto";
import type { LoginParticipantPort } from "./ports/login-participant.port";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class LoginParticipantUseCase implements LoginParticipantPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: { email: string }): Promise<{
    token: string;
    refreshToken: string;
    participant: IParticipant;
  }> {
    const participant = await this.participantRepository.findByEmail(
      input.email,
    );

    if (!participant) {
      throw new NotFoundError("Participante não encontrado.");
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
}
