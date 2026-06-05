import { type ITrip } from "./trip.dto";

export interface ActivityDTO {
  id: string;
  title: string;
  occursAt: Date;
  tripId: string;
}

export interface CreateActivityDTO {
  id: string;
  title: string;
  occursAt: Date;
  tripId: string;
}

export interface ActivitiesListDTO {
  date: Date;
  activities: ActivityDTO[];
}

export interface ActivityDetailDTO {
  id: string;
  title: string;
  occursAt: Date;
  trip: ITrip;
}
