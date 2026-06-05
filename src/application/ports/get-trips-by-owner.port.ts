import { type ITrip } from "../dto/trip.dto";

export interface GetTripsByOwnerPort {
  execute(input: { userId: string }): Promise<ITrip[]>;
}
