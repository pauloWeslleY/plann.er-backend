import {
  type CreateParticipantDTO,
  type ParticipantDTO,
} from "../dto/participant.dto";

export interface CreateParticipantPort {
  execute(
    input: CreateParticipantDTO,
  ): Promise<Pick<ParticipantDTO, "email" | "name">[]>;
}
