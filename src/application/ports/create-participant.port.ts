import {
  type CreateParticipantDTO,
  type ParticipantListDTO,
} from "../dto/participant.dto";

export interface CreateParticipantPort {
  execute(input: CreateParticipantDTO): Promise<ParticipantListDTO[]>;
}
