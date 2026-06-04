import { type UpdateTripDTO } from "../dto/trip.dto";

export interface UpdateTripPort {
  execute(input: UpdateTripDTO): Promise<{ tripId: string }>;
}
