import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { TripStatus } from "./dto/trip.dto";
import type { ConfirmParticipantPort } from "./ports/confirm-participant.port";
import type { ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class ConfirmParticipantUseCase implements ConfirmParticipantPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: {
    participantId: string;
    tripId: string;
  }): Promise<{ tripId: string }> {
    const [participant, trip] = await Promise.all([
      this.participantRepository.findById(input.participantId),
      this.tripRepository.findById(input.tripId),
    ]);

    if (!participant || !trip) {
      throw new NotFoundError("Participante ou viagem não encontrado.");
    }

    if (trip.status === TripStatus.CANCELLED) {
      throw new BadRequestError(
        "Não é possível confirmar participação em uma viagem cancelada.",
      );
    }

    participant.confirmIfNeeded();
    await this.participantRepository.save(participant);

    return {
      tripId: participant.tripId,
    };
  }
}
