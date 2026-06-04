import { type LinkDTO } from "../dto/link.dto";

export interface GetLinksPort {
  execute(input: { tripId: string }): Promise<LinkDTO[]>;
}
