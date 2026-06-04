import { type CreateInviteDTO } from "../dto/invite.dto";

export interface CreateInvitePort {
  execute(input: CreateInviteDTO): Promise<{ participantId: string }>;
}
