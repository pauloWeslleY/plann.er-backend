import { type Trip } from "../core/trip.entity";
import { type TripRow, type TripWithOwnerStatusRow } from "../dto/trip.dto";

export interface TripRepositoryPort {
  save(data: { isConfirmed: boolean; tripId: string }): Promise<void>;
  update(trip: Trip): Promise<void>;
  findByDestination(destination: string): Promise<TripRow | null>;
  findById(id: string): Promise<TripRow | null>;
  findByTripAndUserId(
    tripId: string,
    userId: string,
  ): Promise<TripWithOwnerStatusRow | null>;
}
