import { type IDateService } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { Activity } from "./core/activity.entity";
import {
  type ActivityDTO,
  type CreateActivityDTO as UpdateActivityDTO,
} from "./dto/activities.dto";
import { TripStatus } from "./dto/trip.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type UpdateActivityPort } from "./ports/update-activity.port";

export class UpdateActivityUseCase implements UpdateActivityPort {
  constructor(
    private readonly activityRepository: ActivityRepositoryPort,
    private readonly dateService: IDateService,
  ) {}

  async execute(input: UpdateActivityDTO): Promise<ActivityDTO> {
    const alreadyActivity = await this.activityRepository.findById(
      input.id,
      input.tripId,
    );

    if (!alreadyActivity) {
      throw new NotFoundError("Atividade não encontrada.");
    }

    if (alreadyActivity.trip.status === TripStatus.CANCELLED) {
      throw new BadRequestError(
        "Atividade não pode ser atualizada para uma viagem com status cancelado.",
      );
    }

    const activityDate = this.dateService.date(input.occursAt);

    if (activityDate.isBefore(alreadyActivity.trip.startsAt)) {
      throw new BadRequestError(
        "A data da atividade não pode ser anterior ao início da viagem.",
      );
    }

    if (activityDate.isAfter(alreadyActivity.trip.endsAt)) {
      throw new BadRequestError(
        "A data da atividade não pode ser posterior ao fim da viagem.",
      );
    }

    const activity = Activity.restore({
      id: alreadyActivity.id,
      title: alreadyActivity.title,
      occursAt: alreadyActivity.occursAt,
      tripId: alreadyActivity.trip.id,
    });

    activity.update({ title: input.title, occursAt: input.occursAt });
    return await this.activityRepository.update(activity);
  }
}
