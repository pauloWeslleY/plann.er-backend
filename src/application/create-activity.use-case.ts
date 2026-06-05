import { v7 as uuidv7 } from "uuid";

import { type DateService } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { Activity } from "./core/activity.entity";
import { type CreateActivityDTO } from "./dto/activities.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type CreateActivityPort } from "./ports/create-activity.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateActivityUseCase implements CreateActivityPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly activityRepository: ActivityRepositoryPort,
    private readonly dateService: DateService,
  ) {}

  async execute(
    input: Omit<CreateActivityDTO, "id">,
  ): Promise<{ activityId: string }> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (!trip.canBeEdited()) {
      throw new BadRequestError(
        "Atividade não pode ser criada para uma viagem com status cancelado.",
      );
    }

    const tripDate = {
      startsAt: this.dateService.date(trip.startsAt),
      endsAt: this.dateService.date(trip.endsAt),
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

    await this.activityRepository.create(activity);

    return {
      activityId: activity.id,
    };
  }
}
