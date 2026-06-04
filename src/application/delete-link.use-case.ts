import { NotFoundError } from "@/resources/errors/app-error";

import { type DeleteLinkDTO } from "./dto/link.dto";
import { type DeleteLinkPort } from "./ports/delete-link.port";
import { type LinkRepositoryPort } from "./ports/link.repository.port";

export class DeleteLinkUseCase implements DeleteLinkPort {
  constructor(private readonly linkRepository: LinkRepositoryPort) {}

  async execute(input: DeleteLinkDTO): Promise<void> {
    const link = await this.linkRepository.findById(input.id, input.tripId);

    if (!link) {
      throw new NotFoundError("Link não encontrado.");
    }

    await this.linkRepository.delete(input);
  }
}
