import { Trip } from "@/application/core/trip.entity";
import { type ITrip, type TripDTO } from "@/application/dto/trip.dto";

export class TripMapper {
  static toDomain(row: ITrip): Trip {
    return Trip.restore({
      id: row.id,
      userId: row.userId,
      destination: row.destination,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
      status: row.status,
    });
  }

  static toPersistence(trip: ITrip) {
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

  static toDTO(trip: ITrip): TripDTO {
    return {
      id: trip.id,
      isConfirmed: trip.isConfirmed,
      destination: trip.destination,
      startsAt: trip.startsAt,
      endsAt: trip.endsAt,
    };
  }
}
