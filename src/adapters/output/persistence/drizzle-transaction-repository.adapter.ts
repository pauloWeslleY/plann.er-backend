import { type CreateTripDTO } from "@/application/dto/trip.dto";
import { type IUnitOfWorkTransaction } from "@/application/ports/unit-of-work-transaction.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

export class UnitOfWorkTransaction implements IUnitOfWorkTransaction {
  async transaction(
    input: Required<CreateTripDTO & { tripId: string }>,
  ): Promise<{ id: string }> {
    return await database.transaction(async (tx) => {
      const [createdTrip] = await tx
        .insert(schema.TripsTable)
        .values({
          id: input.tripId,
          destination: input.destination,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          userId: input.userId,
        })
        .returning({ id: schema.TripsTable.id });

      const participantsToCreate = [
        {
          name: input.ownerName,
          email: input.ownerEmail,
          isOwner: true,
          isConfirmed: true,
        },
        ...input.emailsToInvite.map((email) => ({
          name: null,
          email,
          isOwner: false,
          isConfirmed: false,
        })),
      ];

      for (const participantToCreate of participantsToCreate) {
        const [participant] = await tx
          .insert(schema.ParticipantsTable)
          .values({
            name: participantToCreate.name,
            email: participantToCreate.email,
          })
          .returning({ id: schema.ParticipantsTable.id });

        await tx.insert(schema.ParticipantsTripsTable).values({
          participantId: participant.id,
          tripId: createdTrip.id,
          isOwner: participantToCreate.isOwner,
          isConfirmed: participantToCreate.isConfirmed,
        });
      }

      return createdTrip;
    });
  }
}
