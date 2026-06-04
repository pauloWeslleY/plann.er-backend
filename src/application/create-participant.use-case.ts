import { BadRequestError } from "@/resources/errors/app-error";

import {
  type CreateParticipantDTO,
  type ParticipantDTO,
} from "./dto/participant.dto";
import { type CreateParticipantPort } from "./ports/create-participant.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class CreateParticipantUseCase implements CreateParticipantPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(
    input: CreateParticipantDTO,
  ): Promise<Pick<ParticipantDTO, "email" | "name">[]> {
    const existingParticipant = await this.participantRepository.findByTripId(
      input.tripId,
    );

    const existingParticipantWithEmail = existingParticipant.some(
      (participant) =>
        input.participants.some((p) => p.email === participant.email),
    );

    if (existingParticipantWithEmail) {
      throw new BadRequestError(
        "Já existe um participante com esse email na viagem.",
      );
    }

    const result = await this.participantRepository.create(input);
    return result;
  }
}
