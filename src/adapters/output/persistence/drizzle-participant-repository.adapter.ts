import { and, eq } from "drizzle-orm";

import type { Participant } from "@/application/core/participant.entity";
import {
  type CreateParticipantDTO,
  type GetParticipantDTO,
  type ParticipantDTO,
  type ParticipantListDTO,
  type ParticipantRow,
  type ParticipantsRow,
  type UpdateParticipantDTO,
} from "@/application/dto/participant.dto";
import type { ParticipantRepositoryPort } from "@/application/ports/participant-repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

import { ParticipantMapper } from "../mappers/participant.mapper";

export class DrizzleParticipantRepositoryAdapter implements ParticipantRepositoryPort {
  async findById(id: string): Promise<Participant | null> {
    const [row] = await database
      .select({
        participant: schema.ParticipantsTable,
        participantTrip: schema.ParticipantsTripsTable,
      })
      .from(schema.ParticipantsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        eq(
          schema.ParticipantsTripsTable.participantId,
          schema.ParticipantsTable.id,
        ),
      )
      .where(eq(schema.ParticipantsTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return ParticipantMapper.toDomain(row);
  }

  async findDetailsById(id: string): Promise<ParticipantDTO | null> {
    const [row] = await database
      .select({
        id: schema.ParticipantsTable.id,
        name: schema.ParticipantsTable.name,
        email: schema.ParticipantsTable.email,
        tripId: schema.ParticipantsTripsTable.tripId,
        isOwner: schema.ParticipantsTripsTable.isOwner,
        isConfirmed: schema.ParticipantsTripsTable.isConfirmed,
      })
      .from(schema.ParticipantsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        eq(
          schema.ParticipantsTripsTable.participantId,
          schema.ParticipantsTable.id,
        ),
      )
      .where(eq(schema.ParticipantsTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return ParticipantMapper.toDTO({
      participant: { id: row.id, name: row.name, email: row.email },
      participantTrip: {
        participantId: row.id,
        tripId: row.tripId,
        isOwner: row.isOwner,
        isConfirmed: row.isConfirmed,
      },
    });
  }

  async findByTripWithoutOwner(tripId: string): Promise<GetParticipantDTO[]> {
    const participants = await database
      .select({
        id: schema.ParticipantsTable.id,
        name: schema.ParticipantsTable.name,
        email: schema.ParticipantsTable.email,
        is_confirmed: schema.ParticipantsTripsTable.isConfirmed,
      })
      .from(schema.ParticipantsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        and(
          eq(
            schema.ParticipantsTripsTable.participantId,
            schema.ParticipantsTable.id,
          ),
          eq(schema.ParticipantsTripsTable.isOwner, false),
        ),
      )
      .where(eq(schema.ParticipantsTripsTable.tripId, tripId));

    return participants.map(ParticipantMapper.toGetListDTO);
  }

  async findByTripId(tripId: string): Promise<ParticipantsRow[]> {
    const participants = await database
      .select({
        id: schema.ParticipantsTable.id,
        name: schema.ParticipantsTable.name,
        email: schema.ParticipantsTable.email,
        is_confirmed: schema.ParticipantsTripsTable.isConfirmed,
        is_owner: schema.ParticipantsTripsTable.isOwner,
        trip_id: schema.ParticipantsTripsTable.tripId,
      })
      .from(schema.ParticipantsTable)
      .innerJoin(
        schema.ParticipantsTripsTable,
        eq(
          schema.ParticipantsTripsTable.participantId,
          schema.ParticipantsTable.id,
        ),
      )
      .where(eq(schema.ParticipantsTripsTable.tripId, tripId));

    return participants;
  }

  async findByEmail(
    email: string,
  ): Promise<ParticipantRow["participant"] | null> {
    const [result] = await database
      .select()
      .from(schema.ParticipantsTable)
      .where(eq(schema.ParticipantsTable.email, email))
      .limit(1);

    if (!result) {
      return null;
    }

    return result;
  }

  async save(participant: Participant): Promise<void> {
    await database
      .update(schema.ParticipantsTripsTable)
      .set({
        isConfirmed: participant.isConfirmed(),
      })
      .where(
        and(
          eq(schema.ParticipantsTripsTable.participantId, participant.id),
          eq(schema.ParticipantsTripsTable.tripId, participant.tripId),
        ),
      );
  }

  async create(data: CreateParticipantDTO): Promise<ParticipantListDTO[]> {
    return await database.transaction(async (tx) => {
      const createdParticipants: ParticipantListDTO[] = [];

      for (const participantData of data.participants) {
        const [createdParticipant] = await tx
          .insert(schema.ParticipantsTable)
          .values({
            name: participantData.name,
            email: participantData.email,
          })
          .returning({
            id: schema.ParticipantsTable.id,
            name: schema.ParticipantsTable.name,
            email: schema.ParticipantsTable.email,
          });

        await tx.insert(schema.ParticipantsTripsTable).values({
          participantId: createdParticipant.id,
          tripId: data.tripId,
          isOwner: false,
          isConfirmed: false,
        });

        createdParticipants.push({
          id: createdParticipant.id,
          email: createdParticipant.email,
          name: createdParticipant.name,
        });
      }

      return createdParticipants;
    });
  }

  async update(data: UpdateParticipantDTO): Promise<ParticipantDTO> {
    const [result] = await database
      .update(schema.ParticipantsTable)
      .set({
        name: data.name,
        email: data.email,
      })
      .from(schema.ParticipantsTripsTable)
      .where(
        and(
          eq(schema.ParticipantsTable.id, data.participantId),
          eq(schema.ParticipantsTripsTable.tripId, data.tripId),
        ),
      )
      .returning({
        id: schema.ParticipantsTable.id,
        name: schema.ParticipantsTable.name,
        email: schema.ParticipantsTable.email,
        tripId: schema.ParticipantsTripsTable.tripId,
        isOwner: schema.ParticipantsTripsTable.isOwner,
        isConfirmed: schema.ParticipantsTripsTable.isConfirmed,
      });

    return result;
  }

  async delete(id: string, tripId: string): Promise<void> {
    await database
      .delete(schema.ParticipantsTripsTable)
      .where(
        and(
          eq(schema.ParticipantsTripsTable.participantId, id),
          eq(schema.ParticipantsTripsTable.tripId, tripId),
        ),
      );
  }
}
