import { type CreateTripDTO } from "../dto/trip.dto";

export interface CreateTripPort {
  execute(
    input: CreateTripDTO,
  ): Promise<{ tripId: string; emailSent: boolean }>;
}
