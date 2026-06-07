import { type TripDTO, type UpdateTripDTO } from "../dto/trip.dto";

export interface UpdateTripPort {
  execute(input: UpdateTripDTO): Promise<{ trip: TripDTO }>;
}
