import { type Participant } from "../core/participant.entity";
import {
  type CreateParticipantDTO,
  type ParticipantDTO,
  type ParticipantRow,
  type ParticipantsRow,
  type UpdateParticipantDTO,
} from "../dto/participant.dto";

export interface ParticipantRepositoryPort {
  findByTripId(tripId: string): Promise<ParticipantsRow[]>;
  findById(id: string): Promise<ParticipantRow | null>;
  findByEmail(email: string): Promise<ParticipantRow["participant"] | null>;
  save(participant: Participant): Promise<void>;
  update(participant: UpdateParticipantDTO): Promise<ParticipantDTO>;
  create(
    participant: CreateParticipantDTO,
  ): Promise<Pick<ParticipantDTO, "email" | "name">[]>;
  delete(id: string, tripId: string): Promise<void>;
}
