import { BadRequestError } from "@/resources/errors/app-error";

import { TripStatus } from "./dto/trip.dto";
import { type DeleteParticipantPort } from "./ports/delete-participant.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class DeleteParticipantUseCase implements DeleteParticipantPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: {
    participantId: string;
    tripId: string;
  }): Promise<void> {
    const [trip, participants] = await Promise.all([
      this.tripRepository.findById(input.tripId),
      this.participantRepository.findByTripId(input.tripId),
    ]);

    const hasParticipantsOwner = participants.find(
      (participant) => participant.id === input.participantId,
    );

    if (hasParticipantsOwner && hasParticipantsOwner.is_owner) {
      throw new BadRequestError(
        "Não é possível deletar o participante proprietário da viagem.",
      );
    }

    const participantToDelete = participants.some(
      (participant) => participant.id === input.participantId,
    );

    if (!participantToDelete) {
      throw new BadRequestError("Participante não encontrado.");
    }

    if (!trip) {
      throw new BadRequestError("Viagem não encontrada.");
    }

    if (trip.status === TripStatus.CANCELLED) {
      throw new BadRequestError(
        "Não é possível deletar um participante de uma viagem cancelada.",
      );
    }

    await this.participantRepository.delete(input.participantId, input.tripId);
  }
}
