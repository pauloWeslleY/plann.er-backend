import {
  type ParticipantDTO,
  type UpdateParticipantDTO,
} from "../dto/participant.dto";

export interface UpdateParticipantPort {
  execute(input: UpdateParticipantDTO): Promise<ParticipantDTO>;
}
