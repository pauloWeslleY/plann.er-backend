import { type ITrip } from "./trip.dto";

export interface LinkRow {
  id: string;
  title: string;
  tripId: string;
  url: string;
}

export interface CreateLinkDTO {
  id: string;
  tripId: string;
  title: string;
  url: string;
}

export interface LinkDTO {
  id: string;
  title: string;
  url: string;
}

export interface InputLinkDTO {
  tripId: string;
  title: string;
  url: string;
}

export interface DeleteLinkDTO {
  id: string;
  tripId: string;
}

export interface LinkDetailsDTO {
  id: string;
  title: string;
  url: string;
  trip: ITrip | null;
}
