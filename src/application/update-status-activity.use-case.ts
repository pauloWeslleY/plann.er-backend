import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { Activity } from "./core/activity.entity";
import {
  type ActivityDTO,
  type UpdateStatusActivityDTO,
} from "./dto/activities.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type UpdateStatusActivityPort } from "./ports/update-status-activity.port";

export class UpdateStatusActivityUseCase implements UpdateStatusActivityPort {
  constructor(
    private readonly activityRepository: ActivityRepositoryPort,
    private readonly tripRepository: TripRepositoryPort,
  ) {}

  async execute(input: UpdateStatusActivityDTO): Promise<ActivityDTO> {
    const [existingActivity, trip] = await Promise.all([
      this.activityRepository.findById(input.id, input.tripId),
      this.tripRepository.findById(input.tripId),
    ]);

    if (!existingActivity) {
      throw new NotFoundError("Atividade não encontrada.");
    }

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (!trip.canBeEdited()) {
      throw new BadRequestError(
        "Viagem não pode ser editada no status cancelado.",
      );
    }

    const updatedActivity = Activity.create(existingActivity.id, {
      title: existingActivity.title,
      occursAt: existingActivity.occursAt,
      tripId: existingActivity.trip.id,
      isDone: existingActivity.isDone,
    });

    updatedActivity.updateStatus(input.isDone);

    await this.activityRepository.status({
      id: input.id,
      tripId: input.tripId,
      isDone: updatedActivity.isDone,
    });

    return updatedActivity;
  }
}
