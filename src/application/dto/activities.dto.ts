import { type ITrip } from "./trip.dto";

export interface ActivityDTO {
  id: string;
  title: string;
  occursAt: Date;
  isDone: boolean;
  tripId: string;
}

export interface CreateActivityDTO {
  id: string;
  title: string;
  occursAt: Date;
  tripId: string;
}

export interface UpdateStatusActivityDTO {
  id: string;
  tripId: string;
  isDone: boolean;
}

export interface ActivitiesListDTO {
  date: Date;
  activities: ActivityDTO[];
}

export interface ActivityDetailDTO {
  id: string;
  title: string;
  occursAt: Date;
  isDone: boolean;
  trip: ITrip;
}
