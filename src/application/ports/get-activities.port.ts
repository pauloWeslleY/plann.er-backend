import { type ActivitiesListDTO } from "../dto/activities.dto";

export interface GetActivitiesPort {
  execute(input: { tripId: string }): Promise<ActivitiesListDTO[]>;
}
