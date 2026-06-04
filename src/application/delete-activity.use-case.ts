import { NotFoundError } from "@/resources/errors/app-error";

import { type CreateActivityDTO } from "./dto/activities.dto";
import { TripStatus } from "./dto/trip.dto";
import { type ActivityRepositoryPort } from "./ports/activities.repository.port";
import { type DeleteActivityPort } from "./ports/delete-activity.port";

export class DeleteActivityUseCase implements DeleteActivityPort {
  constructor(private readonly activityRepository: ActivityRepositoryPort) {}

  async execute(
    input: Pick<CreateActivityDTO, "id" | "tripId">,
  ): Promise<void> {
    const activity = await this.activityRepository.findById(
      input.id,
      input.tripId,
    );

    if (!activity) {
      throw new NotFoundError("Atividade não encontrada.");
    }

    if (!activity.trip) {
      throw new Error("Atividade não está associada a uma viagem.");
    }

    if (activity.trip.status === TripStatus.CANCELLED) {
      throw new Error(
        "Não é possível deletar uma atividade de uma viagem cancelada.",
      );
    }

    await this.activityRepository.delete(input.id, input.tripId);
  }
}
