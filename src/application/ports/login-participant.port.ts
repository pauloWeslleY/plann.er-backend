import { type IParticipant } from "../dto/participant.dto";

export interface LoginParticipantPort {
  execute(input: { email: string }): Promise<{
    token: string;
    refreshToken: string;
    participant: IParticipant;
  }>;
}
