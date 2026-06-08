import { type TripDTO, type UpdateStatusTripDTO } from "../dto/trip.dto";

export interface UpdateStatusTripPort {
  execute(input: UpdateStatusTripDTO): Promise<TripDTO>;
}
