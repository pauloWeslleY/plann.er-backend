import { type Trip } from "../core/trip.entity";
import {
  type ITrip,
  type TripDetailsDTO,
  type TripDTO,
  type TripWithOwnerStatusRow,
} from "../dto/trip.dto";

export interface TripRepositoryPort {
  save(data: { isConfirmed: boolean; tripId: string }): Promise<void>;
  update(trip: Trip): Promise<void>;
  findManyTripsByUserId(userId: string): Promise<ITrip[]>;
  findByDestination(destination: string): Promise<ITrip | null>;
  findById(id: string): Promise<Trip | null>;
  findUniqueTripAndOwner(tripId: string): Promise<TripDetailsDTO | null>;
  findDetails(id: string): Promise<TripDTO | null>;
  findByTripAndUserId(
    tripId: string,
    userId: string,
  ): Promise<TripWithOwnerStatusRow | null>;
}
