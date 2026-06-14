import { Participant } from "@/application/core/participant.entity";
import {
  type GetParticipantDTO,
  type ParticipantDTO,
  type ParticipantRow,
  type ParticipantsRow,
} from "@/application/dto/participant.dto";

export class ParticipantMapper {
  static toDomain(row: ParticipantRow): Participant {
    return Participant.restore(row.participant.id, {
      tripId: row.participantTrip.tripId,
      name: row.participant.name,
      email: row.participant.email,
      isConfirmed: row.participantTrip.isConfirmed,
    });
  }

  static toPersistence(participant: Participant) {
    return {
      isConfirmed: participant.isConfirmed(),
    };
  }

  static toDTO(row: ParticipantRow): ParticipantDTO {
    return {
      id: row.participant.id,
      name: row.participant.name,
      email: row.participant.email,
      isConfirmed: row.participantTrip.isConfirmed,
      isOwner: row.participantTrip.isOwner,
      tripId: row.participantTrip.tripId,
    };
  }

  static toGetListDTO(
    row: Pick<ParticipantsRow, "id" | "name" | "email" | "is_confirmed">,
  ): GetParticipantDTO {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      isConfirmed: row.is_confirmed,
    };
  }
}
