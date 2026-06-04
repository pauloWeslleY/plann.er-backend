import { type CreateActivityDTO } from "../dto/activities.dto";

export interface CreateActivityPort {
  execute(
    input: Omit<CreateActivityDTO, "id">,
  ): Promise<{ activityId: string }>;
}
