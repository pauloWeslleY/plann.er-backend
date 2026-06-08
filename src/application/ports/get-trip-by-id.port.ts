import { type TripFullDetailsDTO } from "../dto/trip.dto";

export interface GetTripByIdPort {
  execute(input: { tripId: string }): Promise<TripFullDetailsDTO>;
}
