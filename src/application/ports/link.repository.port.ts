import {
  type CreateLinkDTO,
  type DeleteLinkDTO,
  type LinkDetailsDTO,
  type LinkRow,
} from "../dto/link.dto";

export interface LinkRepositoryPort {
  create(data: CreateLinkDTO): Promise<LinkRow>;
  delete(data: DeleteLinkDTO): Promise<void>;
  findManyByTripId(tripId: string): Promise<Omit<LinkRow, "tripId">[]>;
  findById(id: string, tripId: string): Promise<LinkRow | null>;
  findLinkById(data: {
    id: string;
    tripId: string;
  }): Promise<LinkDetailsDTO | null>;
}
