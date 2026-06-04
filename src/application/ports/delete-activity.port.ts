import { type CreateActivityDTO as ActivityRepositoryDTO } from "../dto/activities.dto";

export interface DeleteActivityPort {
  execute(input: Pick<ActivityRepositoryDTO, "id" | "tripId">): Promise<void>;
}
