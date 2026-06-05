import { type Activity } from "../core/activity.entity";
import {
  type ActivityDetailDTO,
  type ActivityDTO,
  type CreateActivityDTO as ActivityRepositoryDTO,
} from "../dto/activities.dto";

export interface ActivityRepositoryPort {
  create(data: Activity): Promise<ActivityDTO>;
  update(data: ActivityRepositoryDTO): Promise<ActivityDTO>;
  delete(id: string, tripId: string): Promise<void>;
  findManyByTripId(tripId: string): Promise<ActivityDTO[]>;
  findById(id: string, tripId: string): Promise<ActivityDetailDTO | null>;
}
