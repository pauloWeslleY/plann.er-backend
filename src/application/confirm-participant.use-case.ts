import { ParticipantMapper } from "@/adapters/output/mappers/participant.mapper";
import { NotFoundError } from "@/resources/errors/app-error";

import type { ConfirmParticipantPort } from "./ports/confirm-participant.port";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class ConfirmParticipantUseCase implements ConfirmParticipantPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: { participantId: string }): Promise<{ tripId: string }> {
    const participant = await this.participantRepository.findById(
      input.participantId,
    );

    if (!participant) {
      throw new NotFoundError("Participant not found.");
    }

    const participantDomain = ParticipantMapper.toDomain(participant);
    participantDomain.confirmIfNeeded();

    await this.participantRepository.save(participantDomain);

    return {
      tripId: participantDomain.tripId,
    };
  }
}
