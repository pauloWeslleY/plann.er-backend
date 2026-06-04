import { type InputLinkDTO } from "../dto/link.dto";

export interface CreateLinkPort {
  execute(input: InputLinkDTO): Promise<{ linkId: string }>;
}
