import { NotFoundError } from "@/resources/errors/app-error";

import { type TripDTO } from "./dto/trip.dto";
import { type GetTripDetailsPort } from "./ports/get-trip-details.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetTripDetailsUseCase implements GetTripDetailsPort {
  constructor(private readonly tripRepository: TripRepositoryPort) {}

  async execute(input: { tripId: string }): Promise<TripDTO> {
    const trip = await this.tripRepository.findDetails(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    return trip;
  }
}
