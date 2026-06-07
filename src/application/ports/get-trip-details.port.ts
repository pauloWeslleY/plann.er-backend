import { type TripDetailsDTO } from "../dto/trip.dto";

export interface GetTripDetailsPort {
  execute(input: { tripId: string }): Promise<TripDetailsDTO>;
}
