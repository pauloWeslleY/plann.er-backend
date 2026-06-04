import { type Activity } from "../core/activity.entity";
import {
  type ActivitiesByTripIdDTO,
  type ActivityRow,
  type CreateActivityDTO as ActivityRepositoryDTO,
} from "../dto/activities.dto";

export interface ActivityRepositoryPort {
  create(data: Activity): Promise<ActivityRow>;
  update(data: ActivityRepositoryDTO): Promise<ActivityRow>;
  delete(id: string, tripId: string): Promise<void>;
  findManyByTripId(tripId: string): Promise<ActivityRow[]>;
  findById(id: string, tripId: string): Promise<ActivitiesByTripIdDTO | null>;
}
