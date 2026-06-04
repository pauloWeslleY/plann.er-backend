import { NotFoundError } from "@/resources/errors/app-error";

import { type DeleteLinkDTO } from "./dto/link.dto";
import { TripStatus } from "./dto/trip.dto";
import { type DeleteLinkPort } from "./ports/delete-link.port";
import { type LinkRepositoryPort } from "./ports/link.repository.port";

export class DeleteLinkUseCase implements DeleteLinkPort {
  constructor(private readonly linkRepository: LinkRepositoryPort) {}

  async execute(input: DeleteLinkDTO): Promise<void> {
    const link = await this.linkRepository.findLinkById(input);

    if (!link) {
      throw new NotFoundError("Link não encontrado.");
    }

    if (!link.trip) {
      throw new Error("Link não está associado a uma viagem.");
    }

    if (link.trip.status === TripStatus.CANCELLED) {
      throw new Error(
        "Não é possível deletar um link de uma viagem cancelada.",
      );
    }

    await this.linkRepository.delete(input);
  }
}
