import { type DateService } from "@/resources/date-js/datejs";
import { NotFoundError } from "@/resources/errors/app-error";

import { type ActivitiesListDTO } from "./dto/activities.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type GetActivitiesPort } from "./ports/get-activities.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class GetActivitiesUseCase implements GetActivitiesPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly activitiesRepository: ActivityRepositoryPort,
    private readonly dateService: DateService,
  ) {}

  async execute(input: { tripId: string }): Promise<ActivitiesListDTO[]> {
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

    const differenceInDaysBetweenTripStartAndEnd = this.dateService
      .date(trip.endsAt)
      .diff(trip.startsAt, "day");

    const activitiesTrip = Array.from({
      length: differenceInDaysBetweenTripStartAndEnd + 1,
    }).map((_, index) => {
      const date = this.dateService.date(trip.startsAt).add(index, "day");

      return {
        date: date.toDate(),
        activities: activities.filter((activity) =>
          this.dateService.date(activity.occursAt).isSame(date, "day"),
        ),
      };
    });

    return activitiesTrip;
  }
}
