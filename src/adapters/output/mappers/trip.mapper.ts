import { Trip } from "@/application/core/trip.entity";
import { type TripDTO, type TripRow } from "@/application/dto/trip.dto";

export class TripMapper {
  static toDomain(row: TripRow): Trip {
    return Trip.restore({
      id: row.id,
      userId: row.userId,
      destination: row.destination,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
      status: row.status,
    });
  }

  static toPersistence(trip: TripRow) {
    return {
      id: trip.id,
      userId: trip.userId,
      destination: trip.destination,
      startsAt: trip.startsAt,
      endsAt: trip.endsAt,
      isConfirmed: trip.isConfirmed,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  static toDTO(trip: TripRow): TripDTO {
    return {
      id: trip.id,
      isConfirmed: trip.isConfirmed,
      destination: trip.destination,
      startsAt: trip.startsAt,
      endsAt: trip.endsAt,
    };
  }
}
