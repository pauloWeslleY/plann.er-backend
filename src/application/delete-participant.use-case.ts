import { BadRequestError } from "@/resources/errors/app-error";

import { type DeleteParticipantPort } from "./ports/delete-participant.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class DeleteParticipantUseCase implements DeleteParticipantPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: {
    participantId: string;
    tripId: string;
  }): Promise<void> {
    const existingParticipant = await this.participantRepository.findByTripId(
      input.tripId,
    );

    const participantToDelete = existingParticipant.find(
      (participant) => participant.id === input.participantId,
    );

    if (!participantToDelete) {
      throw new BadRequestError("Participante não encontrado.");
    }

    await this.participantRepository.delete(input.participantId);
  }
}
