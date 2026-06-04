import { v7 as uuidv7 } from "uuid";

import { LinkMapper } from "@/adapters/output/mappers/link.mapper";
import { NotFoundError } from "@/resources/errors/app-error";

import { type InputLinkDTO } from "./dto/link.dto";
import { type CreateLinkPort } from "./ports/create-link.port";
import { type LinkRepositoryPort } from "./ports/link.repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateLinkUseCase implements CreateLinkPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly linkRepository: LinkRepositoryPort,
  ) {}

  async execute(input: InputLinkDTO): Promise<{ linkId: string }> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    const link = await this.linkRepository.create({
      id: uuidv7(),
      tripId: trip.id,
      title: input.title,
      url: input.url,
    });

    const linkDTO = LinkMapper.toDTO(link);

    return {
      linkId: linkDTO.id,
    };
  }
}
