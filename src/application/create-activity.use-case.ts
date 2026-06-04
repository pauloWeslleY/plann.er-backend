import { v7 as uuidv7 } from "uuid";

import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";
import { type DateJS } from "@/resources/date-js/datejs";

import { Activity } from "./core/activity.entity";
import { type CreateActivityDTO } from "./dto/activities.dto";
import { type CreateActivityPort } from "./ports/create-activity.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateActivityUseCase implements CreateActivityPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly service: { date: DateJS },
  ) {}

  async execute(
    input: Omit<CreateActivityDTO, "id">,
  ): Promise<{ activityId: string }> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    const tripDate = {
      startsAt: this.service.date.dayjs(trip.startsAt),
      endsAt: this.service.date.dayjs(trip.endsAt),
    };

    if (tripDate.startsAt.isBefore(new Date())) {
      throw new BadRequestError(
        "Começo da viagem deve ser em uma data futura.",
      );
    }

    if (tripDate.endsAt.isBefore(tripDate.startsAt)) {
      throw new BadRequestError("Fim da viagem deve ser após o início.");
    }

    const activityId = uuidv7();

    const activity = Activity.create(activityId, {
      title: input.title,
      occursAt: tripDate.startsAt.toDate(),
      tripId: input.tripId,
    });

    return {
      activityId: activity.id,
    };
  }
}
