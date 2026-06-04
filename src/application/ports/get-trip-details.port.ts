import { type TripDTO } from "../dto/trip.dto";

export interface GetTripDetailsPort {
  execute(input: { tripId: string }): Promise<TripDTO>;
}
