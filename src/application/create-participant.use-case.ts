import { BadRequestError } from "@/resources/errors/app-error";

import {
  type CreateParticipantDTO,
  type ParticipantDTO,
} from "./dto/participant.dto";
import { TripStatus } from "./dto/trip.dto";
import { type CreateParticipantPort } from "./ports/create-participant.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateParticipantUseCase implements CreateParticipantPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(
    input: CreateParticipantDTO,
  ): Promise<Pick<ParticipantDTO, "id" | "email" | "name">[]> {
    const [existingParticipant, trip] = await Promise.all([
      this.participantRepository.findByTripId(input.tripId),
      this.tripRepository.findById(input.tripId),
    ]);

    if (!trip) {
      throw new BadRequestError("Viagem não encontrada.");
    }

    if (trip.status === TripStatus.CANCELLED) {
      throw new BadRequestError(
        "Participante não pode ser adicionado para uma viagem com status cancelado.",
      );
    }

    const existingParticipantWithEmail = existingParticipant.some(
      (participant) =>
        input.participants.some((p) => p.email === participant.email),
    );

    if (existingParticipantWithEmail) {
      throw new BadRequestError(
        "Já existe um participante com esse email na viagem.",
      );
    }

    return await this.participantRepository.create(input);
  }
}
