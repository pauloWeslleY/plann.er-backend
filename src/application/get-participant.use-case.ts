import { ParticipantMapper } from "@/adapters/output/mappers/participant.mapper";
import { NotFoundError } from "@/resources/errors/app-error";

import { type ParticipantDTO } from "./dto/participant.dto";
import { type GetParticipantPort } from "./ports/get-participant.port";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class GetParticipantUseCase implements GetParticipantPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: { participantId: string }): Promise<ParticipantDTO> {
    const participant = await this.participantRepository.findById(
      input.participantId,
    );

    if (!participant) {
      throw new NotFoundError("Participant not found.");
    }

    return ParticipantMapper.toDTO(participant);
  }
}
