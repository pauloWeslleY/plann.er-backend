import { LinkMapper } from "@/adapters/output/mappers/link.mapper";
import { NotFoundError } from "@/resources/errors/app-error";

import { type LinkDTO } from "./dto/link.dto";
import { type GetLinksPort } from "./ports/get-links.port";
import { type LinkRepositoryPort } from "./ports/link.repository.port";

export class GetLinksUseCase implements GetLinksPort {
  constructor(private readonly linkRepository: LinkRepositoryPort) {}

  async execute(input: { tripId: string }): Promise<LinkDTO[]> {
    const links = await this.linkRepository.findManyByTripId(input.tripId);

    if (!links || links.length === 0) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    return links.map((link) =>
      LinkMapper.toDTO({
        id: link.id,
        title: link.title,
        url: link.url,
        tripId: input.tripId,
      }),
    );
  }
}
