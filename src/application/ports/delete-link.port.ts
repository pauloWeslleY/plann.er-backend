import { type DeleteLinkDTO } from "../dto/link.dto";

export interface DeleteLinkPort {
  execute(input: DeleteLinkDTO): Promise<void>;
}
