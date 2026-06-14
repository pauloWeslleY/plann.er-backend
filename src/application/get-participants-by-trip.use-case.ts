import { NotFoundError } from "@/resources/errors/app-error";

import { type GetParticipantDTO } from "./dto/participant.dto";
import { type GetParticipantsByTripPort } from "./ports/get-participants-by-trip.port";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";

export class GetParticipantsByTripUseCase implements GetParticipantsByTripPort {
  constructor(
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: { tripId: string }): Promise<GetParticipantDTO[]> {
    const participants =
      await this.participantRepository.findByTripWithoutOwner(input.tripId);

    if (!participants || participants.length === 0) {
      throw new NotFoundError(
        "Nenhum participante encontrado para a viagem informada",
      );
    }

    return participants;
  }
}
