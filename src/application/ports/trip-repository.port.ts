import { type Trip } from "../core/trip.entity";
import {
  type ITrip,
  type ManyTripsByParticipantDTO,
  type ManyTripsByUserDTO,
  type TripAndOwnerDTO,
  type TripDetailsDTO,
  type TripDTO,
  type TripFullDetailsDTO,
  type TripStatusType,
  type TripWithOwnerStatusRow,
} from "../dto/trip.dto";

export interface TripRepositoryPort {
  save(data: { isConfirmed: boolean; tripId: string }): Promise<void>;
  update(trip: Trip): Promise<TripDTO>;
  updateStatus(tripId: string, status: TripStatusType): Promise<TripDTO>;
  findFullDetails(tripId: string): Promise<TripFullDetailsDTO | null>;
  findManyTripsByUserId(userId: string): Promise<ManyTripsByUserDTO[]>;
  findByDestination(destination: string): Promise<ITrip | null>;
  findByStartDate(startDate: Date): Promise<ITrip | null>;
  findById(id: string): Promise<Trip | null>;
  findUniqueTripAndOwner(tripId: string): Promise<TripAndOwnerDTO | null>;
  findDetails(id: string): Promise<TripDetailsDTO | null>;
  findManyTripsByParticipantId(
    participantId: string,
  ): Promise<ManyTripsByParticipantDTO[]>;
  findByTripAndUserId(
    tripId: string,
    userId: string,
  ): Promise<TripWithOwnerStatusRow | null>;
}
