import { and, eq } from "drizzle-orm";

import { type Trip } from "@/application/core/trip.entity";
import {
  type TripDetailsDTO,
  type TripRow,
  type TripWithOwnerStatusRow,
} from "@/application/dto/trip.dto";
import { type TripRepositoryPort } from "@/application/ports/trip-repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

export class DrizzleTripRepositoryAdapter implements TripRepositoryPort {
  async findByDestination(destination: string): Promise<TripRow | null> {
    const [result] = await database
      .select()
      .from(schema.TripsTable)
      .where(eq(schema.TripsTable.destination, destination));

    return result ?? null;
  }

  async findUniqueTripAndOwner(tripId: string): Promise<TripDetailsDTO | null> {
    const [result] = await database
      .select({
        id: schema.TripsTable.id,
        destination: schema.TripsTable.destination,
        startsAt: schema.TripsTable.startsAt,
        endsAt: schema.TripsTable.endsAt,
        userId: schema.TripsTable.userId,
        isConfirmed: schema.ParticipantsTripsTable.isConfirmed,
        isOwner: schema.ParticipantsTripsTable.isOwner,
        status: schema.TripsTable.status,
      })
      .from(schema.TripsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        and(
          eq(schema.ParticipantsTripsTable.tripId, schema.TripsTable.id),
          eq(schema.ParticipantsTripsTable.isOwner, true),
        ),
      )
      .where(eq(schema.TripsTable.id, tripId))
      .limit(1);

    return result ?? null;
  }

  async findById(id: string): Promise<TripRow | null> {
    const [result] = await database
      .select()
      .from(schema.TripsTable)
      .where(eq(schema.TripsTable.id, id));

    return result ?? null;
  }

  async update(trip: Trip): Promise<void> {
    await database
      .update(schema.TripsTable)
      .set({
        destination: trip.destination,
        startsAt: trip.startsAt,
        endsAt: trip.endsAt,
      })
      .where(eq(schema.TripsTable.id, trip.id));
  }

  async save(data: { isConfirmed: boolean; tripId: string }): Promise<void> {
    await database
      .update(schema.ParticipantsTripsTable)
      .set({ isConfirmed: data.isConfirmed })
      .where(eq(schema.ParticipantsTripsTable.tripId, data.tripId));
  }

  async findByTripAndUserId(
    tripId: string,
    userId: string,
  ): Promise<TripWithOwnerStatusRow | null> {
    const [result] = await database
      .select({
        id: schema.TripsTable.id,
        destination: schema.TripsTable.destination,
        startsAt: schema.TripsTable.startsAt,
        endsAt: schema.TripsTable.endsAt,
        userId: schema.TripsTable.userId,
        status: schema.TripsTable.status,
        isOwner: schema.ParticipantsTripsTable.isOwner,
      })
      .from(schema.TripsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        and(
          eq(schema.ParticipantsTripsTable.tripId, schema.TripsTable.id),
          eq(schema.ParticipantsTripsTable.isOwner, true),
        ),
      )
      .where(
        and(
          eq(schema.TripsTable.userId, userId),
          eq(schema.TripsTable.id, tripId),
        ),
      )
      .limit(1);

    return result ?? null;
  }
}
