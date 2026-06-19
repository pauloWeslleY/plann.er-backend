import {
  type ActivityDTO,
  type UpdateStatusActivityDTO,
} from "../dto/activities.dto";

export interface UpdateStatusActivityPort {
  execute(input: UpdateStatusActivityDTO): Promise<ActivityDTO>;
}
