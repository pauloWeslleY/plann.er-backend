import { type ActivityDTO } from "../dto/activities.dto";

export interface GetActivitiesPort {
  execute(input: { tripId: string }): Promise<ActivityDTO[]>;
}
