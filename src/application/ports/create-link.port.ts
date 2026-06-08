import { type InputLinkDTO, type LinkRow } from "../dto/link.dto";

export interface CreateLinkPort {
  execute(input: InputLinkDTO): Promise<LinkRow>;
}
