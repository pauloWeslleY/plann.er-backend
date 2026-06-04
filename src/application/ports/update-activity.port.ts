import {
  type ActivityRow,
  type CreateActivityDTO as UpdateActivityDTO,
} from "../dto/activities.dto";

export interface UpdateActivityPort {
  execute(input: UpdateActivityDTO): Promise<ActivityRow>;
}
