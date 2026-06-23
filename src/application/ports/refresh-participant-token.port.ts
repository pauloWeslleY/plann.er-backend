import { type IParticipant } from "../dto/participant.dto";

export interface RefreshParticipantTokenPort {
  execute(input: { refreshToken: string }): Promise<{
    token: string;
    refreshToken: string;
    participant: IParticipant;
  }>;
}
