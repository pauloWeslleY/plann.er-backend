import { type ActivityDTO } from "../dto/activities.dto";

export interface GetActivitiesByTripPort {
  execute(input: { tripId: string }): Promise<ActivityDTO[]>;
}
