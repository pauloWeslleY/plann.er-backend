import { v7 as uuidv7 } from "uuid";

import { type DateService } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { Activity } from "./core/activity.entity";
import { type ActivityDTO, type CreateActivityDTO } from "./dto/activities.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type CreateActivityPort } from "./ports/create-activity.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateActivityUseCase implements CreateActivityPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly activityRepository: ActivityRepositoryPort,
    private readonly dateService: DateService,
  ) {}

  async execute(input: Omit<CreateActivityDTO, "id">): Promise<ActivityDTO> {
    const [trip, activity] = await Promise.all([
      this.tripRepository.findById(input.tripId),
      this.activityRepository.findByTitle(input.title, input.tripId),
    ]);

    const occursAt = this.dateService.date(input.occursAt);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (!trip.canBeEdited()) {
      throw new BadRequestError(
        "Atividade não pode ser criada para uma viagem com status cancelado.",
      );
    }

    const isValidTitleAndDate =
      activity &&
      this.dateService.date(activity.occursAt).isSame(occursAt, "hours");

    if (isValidTitleAndDate) {
      throw new BadRequestError(
        "Já existe uma atividade com este título na mesma data.",
      );
    }

    if (occursAt.isBefore(trip.startsAt)) {
      throw new BadRequestError(
        "Início da atividade deve ser após o início da viagem.",
      );
    }

    if (occursAt.isAfter(trip.endsAt)) {
      throw new BadRequestError(
        "Fim da atividade deve ser antes do fim da viagem.",
      );
    }

    const activityId = uuidv7();

    const newActivity = Activity.create(activityId, {
      title: input.title,
      occursAt: occursAt.toDate(),
      tripId: input.tripId,
    });

    await this.activityRepository.create(newActivity);
    return newActivity;
  }
}
