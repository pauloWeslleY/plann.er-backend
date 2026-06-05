import { NotFoundError } from "@/resources/errors/app-error";

import { type TripRow } from "./dto/trip.dto";
import { type GetTripsByOwnerPort } from "./ports/get-trips-by-owner.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetTripsByOwnerUseCase implements GetTripsByOwnerPort {
  constructor(private readonly tripRepository: TripRepositoryPort) {}

  async execute(input: { userId: string }): Promise<TripRow[]> {
    const trips = await this.tripRepository.findManyTripsByUserId(input.userId);

    if (!trips || trips.length === 0) {
      throw new NotFoundError("Viagens não encontradas.");
    }

    return trips;
  }
}
