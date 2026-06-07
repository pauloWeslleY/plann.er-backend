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

  static toDTO(trip: ITrip): TripDTO {
    return {
      id: trip.id,
      isConfirmed: trip.isConfirmed,
      destination: trip.destination,
      startsAt: trip.startsAt,
      endsAt: trip.endsAt,
      status: trip.status,
    };
  }
}
