import { type CreateLinkDTO, type LinkRow } from "../dto/link.dto";

export interface LinkRepositoryPort {
  create(data: CreateLinkDTO): Promise<LinkRow>;
  findManyByTripId(tripId: string): Promise<Omit<LinkRow, "tripId">[]>;
}
