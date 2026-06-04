import { type ParticipantDTO } from "../dto/participant.dto";

export interface GetParticipantPort {
  execute(input: { participantId: string }): Promise<ParticipantDTO>;
}
