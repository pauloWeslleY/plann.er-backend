import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import {
  type TripDTO,
  type TripStatus,
  type UpdateStatusTripDTO,
} from "./dto/trip.dto";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type UpdateStatusTripPort } from "./ports/update-status-trip.port";

export class UpdateStatusTripUseCase implements UpdateStatusTripPort {
  constructor(private readonly tripRepository: TripRepositoryPort) {}

  async execute(input: UpdateStatusTripDTO): Promise<TripDTO> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (input.status === trip.status) {
      throw new BadRequestError("O status fornecido é o mesmo que o atual.");
    }

    trip.updateStatus(input.status as TripStatus);

    return await this.tripRepository.updateStatus(trip.id, trip.status);
  }
}
