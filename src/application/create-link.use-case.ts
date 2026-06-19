import { v7 as uuidv7 } from "uuid";

import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { Link } from "./core/link.entity";
import { type InputLinkDTO, type LinkRow } from "./dto/link.dto";
import { type CreateLinkPort } from "./ports/create-link.port";
import { type LinkRepositoryPort } from "./ports/link.repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateLinkUseCase implements CreateLinkPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly linkRepository: LinkRepositoryPort,
  ) {}

  async execute(input: InputLinkDTO): Promise<LinkRow> {
    const [trip, existingLink] = await Promise.all([
      this.tripRepository.findById(input.tripId),
      this.linkRepository.findByTitle(input.title, input.tripId),
    ]);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (existingLink) {
      throw new BadRequestError(
        "Já existe um link com este título para esta viagem.",
      );
    }

    if (!trip.canBeEdited()) {
      throw new BadRequestError(
        "Link não pode ser criado para uma viagem com status cancelado.",
      );
    }

    const linkId = uuidv7();

    const link = Link.create(linkId, {
      tripId: trip.id,
      title: input.title,
      url: input.url,
    });

    return await this.linkRepository.create(link);
  }
}
