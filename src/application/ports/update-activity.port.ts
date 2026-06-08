import {
  type ActivityDTO,
  type CreateActivityDTO as UpdateActivityDTO,
} from "../dto/activities.dto";

export interface UpdateActivityPort {
  execute(input: UpdateActivityDTO): Promise<ActivityDTO>;
}
