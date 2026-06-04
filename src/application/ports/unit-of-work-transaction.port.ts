import { type CreateTripDTO } from "../dto/trip.dto";

export interface IUnitOfWorkTransaction {
  transaction(
    input: Required<CreateTripDTO & { tripId: string }>,
  ): Promise<{ id: string }>;
}
