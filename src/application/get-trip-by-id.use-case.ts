import { NotFoundError } from "@/resources/errors/app-error";

import { type TripFullDetailsDTO } from "./dto/trip.dto";
import { type GetTripByIdPort } from "./ports/get-trip-by-id.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetTripByIdUseCase implements GetTripByIdPort {
  constructor(private readonly tripRepository: TripRepositoryPort) {}

  async execute(input: { tripId: string }): Promise<TripFullDetailsDTO> {
    const trip = await this.tripRepository.findFullDetails(input.tripId);

    console.log("[input.tripId] => ", input.tripId);
    console.log("[GetTripByIdUseCase] => ", trip);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    return trip;
  }
}
