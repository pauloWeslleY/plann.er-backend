import { type Participant } from "../core/participant.entity";
import {
  type CreateParticipantDTO,
  type GetParticipantDTO,
  type ParticipantDTO,
  type ParticipantListDTO,
  type ParticipantRow,
  type ParticipantsRow,
  type UpdateParticipantDTO,
} from "../dto/participant.dto";

export interface ParticipantRepositoryPort {
  findByTripId(tripId: string): Promise<ParticipantsRow[]>;
  findByTripWithoutOwner(tripId: string): Promise<GetParticipantDTO[]>;
  findById(id: string): Promise<Participant | null>;
  findDetailsById(id: string): Promise<ParticipantDTO | null>;
  findByEmail(email: string): Promise<ParticipantRow["participant"] | null>;
  save(participant: Participant): Promise<void>;
  update(participant: UpdateParticipantDTO): Promise<ParticipantDTO>;
  create(participant: CreateParticipantDTO): Promise<ParticipantListDTO[]>;
  delete(id: string, tripId: string): Promise<void>;
}
