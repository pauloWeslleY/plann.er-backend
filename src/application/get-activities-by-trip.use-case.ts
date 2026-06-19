import { NotFoundError } from "@/resources/errors/app-error";

import { type ActivityDTO } from "./dto/activities.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type GetActivitiesByTripPort } from "./ports/get-activities-by-trip.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetActivitiesByTripUseCase implements GetActivitiesByTripPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly activitiesRepository: ActivityRepositoryPort,
  ) {}

  async execute(input: { tripId: string }): Promise<ActivityDTO[]> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    const activities = await this.activitiesRepository.findManyByTripId(
      input.tripId,
    );

    if (!activities || activities.length === 0) {
      throw new NotFoundError("Atividades não encontradas para essa viagem.");
    }

    return activities;
  }
}
