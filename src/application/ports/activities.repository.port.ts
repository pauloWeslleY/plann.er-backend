import {
  type ActivityRow,
  type CreateActivityDTO,
} from "../dto/activities.dto";

export interface ActivityRepositoryPort {
  create(data: CreateActivityDTO): Promise<ActivityRow>;
  findManyByTripId(tripId: string): Promise<ActivityRow[]>;
}
