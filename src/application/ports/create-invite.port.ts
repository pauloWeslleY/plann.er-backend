import { type CreateInviteDTO, type InviteDTO } from "../dto/invite.dto";

export interface CreateInvitePort {
  execute(input: CreateInviteDTO): Promise<InviteDTO>;
}
