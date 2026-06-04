import { Participant } from "@/application/core/participant.entity";
import {
  type ParticipantDTO,
  type ParticipantRow,
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
}
