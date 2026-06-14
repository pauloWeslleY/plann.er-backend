import { and, count, countDistinct, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { type Trip } from "@/application/core/trip.entity";
import {
  type ManyTripsByUserDTO,
  type TripAndOwnerDTO,
  type TripDetailsDTO,
  type TripDTO,
  type TripFullDetailsDTO,
  type TripStatusType,
  type TripWithOwnerStatusRow,
} from "@/application/dto/trip.dto";
import { type TripRepositoryPort } from "@/application/ports/trip-repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

import { TripMapper } from "../mappers/trip.mapper";

type TripRow = typeof schema.TripsTable.$inferSelect;

export class DrizzleTripRepositoryAdapter implements TripRepositoryPort {
  async findByDestination(destination: string): Promise<TripRow | null> {
    const [result] = await database
      .select()
      .from(schema.TripsTable)
      .where(eq(schema.TripsTable.destination, destination));

    return result ?? null;
  }
  async findByStartDate(startDate: Date): Promise<TripRow | null> {
    const [result] = await database
      .select()
      .from(schema.TripsTable)
      .where(eq(schema.TripsTable.startsAt, startDate));

    return result ?? null;
  }

  async findUniqueTripAndOwner(
    tripId: string,
  ): Promise<TripAndOwnerDTO | null> {
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

  async findManyTripsByUserId(userId: string): Promise<ManyTripsByUserDTO[]> {
    const results = await database
      .select({
        id: schema.TripsTable.id,
        destination: schema.TripsTable.destination,
        startsAt: schema.TripsTable.startsAt,
        endsAt: schema.TripsTable.endsAt,
        isConfirmed: schema.TripsTable.isConfirmed,
        status: schema.TripsTable.status,
        createdAt: schema.TripsTable.createdAt,
        updatedAt: schema.TripsTable.updatedAt,
        userId: schema.TripsTable.userId,
        totalParticipants: count(schema.ParticipantsTripsTable.participantId),
      })
      .from(schema.TripsTable)
      .leftJoin(
        schema.ParticipantsTripsTable,
        eq(schema.ParticipantsTripsTable.tripId, schema.TripsTable.id),
      )
      .where(eq(schema.TripsTable.userId, userId))
      .groupBy(schema.TripsTable.id);

    return results;
  }

  async findById(id: string): Promise<Trip | null> {
    const [result] = await database
      .select()
      .from(schema.TripsTable)
      .where(eq(schema.TripsTable.id, id));

    if (!result) {
      return null;
    }

    return TripMapper.toDomain(result);
  }

  async findFullDetails(id: string): Promise<TripFullDetailsDTO | null> {
    const ownerParticipantsTrip = alias(
      schema.ParticipantsTripsTable,
      "owner_participants_trip",
    );

    const participantsTrip = alias(
      schema.ParticipantsTripsTable,
      "participants_trip",
    );

    const [result] = await database
      .select({
        id: schema.TripsTable.id,
        destination: schema.TripsTable.destination,
        startsAt: schema.TripsTable.startsAt,
        endsAt: schema.TripsTable.endsAt,
        status: schema.TripsTable.status,
        isConfirmed: ownerParticipantsTrip.isConfirmed,
        userId: schema.TripsTable.userId,
        totalParticipants: countDistinct(participantsTrip.participantId),
        totalLinks: countDistinct(schema.LinksTable.id),
        totalActivities: countDistinct(schema.ActivitiesTable.id),
        owner: {
          id: schema.ParticipantsTable.id,
          name: schema.ParticipantsTable.name,
          email: schema.ParticipantsTable.email,
        },
      })
      .from(schema.TripsTable)
      .innerJoin(
        ownerParticipantsTrip,
        and(
          eq(ownerParticipantsTrip.tripId, schema.TripsTable.id),
          eq(ownerParticipantsTrip.isOwner, true),
        ),
      )
      .innerJoin(
        schema.ParticipantsTable,
        eq(schema.ParticipantsTable.id, ownerParticipantsTrip.participantId),
      )
      .leftJoin(
        participantsTrip,
        eq(participantsTrip.tripId, schema.TripsTable.id),
      )
      .leftJoin(
        schema.LinksTable,
        eq(schema.LinksTable.tripId, schema.TripsTable.id),
      )
      .leftJoin(
        schema.ActivitiesTable,
        eq(schema.ActivitiesTable.tripId, schema.TripsTable.id),
      )
      .groupBy(
        schema.TripsTable.id,
        schema.ParticipantsTable.id,
        ownerParticipantsTrip.isConfirmed,
      )
      .where(eq(schema.TripsTable.id, id));

    if (!result) {
      return null;
    }

    return result;
  }

  async findDetails(id: string): Promise<TripDetailsDTO | null> {
    const [result] = await database
      .select({
        id: schema.TripsTable.id,
        destination: schema.TripsTable.destination,
        startsAt: schema.TripsTable.startsAt,
        endsAt: schema.TripsTable.endsAt,
        status: schema.TripsTable.status,
        isConfirmed: schema.ParticipantsTripsTable.isConfirmed,
        userId: schema.TripsTable.userId,
        owner: {
          id: schema.ParticipantsTable.id,
          name: schema.ParticipantsTable.name,
          email: schema.ParticipantsTable.email,
        },
      })
      .from(schema.TripsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        and(
          eq(schema.ParticipantsTripsTable.tripId, schema.TripsTable.id),
          eq(schema.ParticipantsTripsTable.isOwner, true),
        ),
      )
      .innerJoin(
        schema.ParticipantsTable,
        eq(
          schema.ParticipantsTable.id,
          schema.ParticipantsTripsTable.participantId,
        ),
      )
      .where(eq(schema.TripsTable.id, id));

    if (!result) {
      return null;
    }

    return result;
  }

  async update(trip: Trip): Promise<TripDTO> {
    const [result] = await database
      .update(schema.TripsTable)
      .set({
        destination: trip.destination,
        startsAt: trip.startsAt,
        endsAt: trip.endsAt,
      })
      .where(eq(schema.TripsTable.id, trip.id))
      .returning();

    return TripMapper.toDTO(result);
  }

  async updateStatus(tripId: string, status: TripStatusType): Promise<TripDTO> {
    const [result] = await database
      .update(schema.TripsTable)
      .set({ status })
      .where(eq(schema.TripsTable.id, tripId))
      .returning();

    return TripMapper.toDTO(result);
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
