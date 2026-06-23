import { NotFoundError } from "@/resources/errors/app-error";

import { type ManyTripsByParticipantDTO } from "./dto/trip.dto";
import { type GetParticipantByTripsPort } from "./ports/get-participant-by-trips.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetParticipantByTripsUseCase implements GetParticipantByTripsPort {
  constructor(private readonly tripRepository: TripRepositoryPort) {}

  async execute(input: {
    participantId: string;
  }): Promise<ManyTripsByParticipantDTO[]> {
    const participants = await this.tripRepository.findManyTripsByParticipantId(
      input.participantId,
    );

    if (!participants || participants.length === 0) {
      throw new NotFoundError(
        "Nenhum participante encontrado para a viagem informada",
      );
    }

    return participants;
  }
}
