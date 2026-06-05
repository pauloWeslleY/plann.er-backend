import { type TripRow } from "../dto/trip.dto";

export interface GetTripsByOwnerPort {
  execute(input: { userId: string }): Promise<TripRow[]>;
}
