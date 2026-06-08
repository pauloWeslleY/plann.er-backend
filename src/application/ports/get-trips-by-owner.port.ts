import { type ManyTripsByUserDTO } from "../dto/trip.dto";

export interface GetTripsByOwnerPort {
  execute(input: { userId: string }): Promise<ManyTripsByUserDTO[]>;
}
