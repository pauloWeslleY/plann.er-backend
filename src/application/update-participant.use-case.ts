import { ParticipantMapper } from "@/adapters/output/mappers/participant.mapper";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import {
  type ParticipantDTO,
  type UpdateParticipantDTO,
} from "./dto/participant.dto";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type UpdateParticipantPort } from "./ports/update-participant.port";

export class UpdateParticipantUseCase implements UpdateParticipantPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly participantRepository: ParticipantRepositoryPort,
  ) {}

  async execute(input: UpdateParticipantDTO): Promise<ParticipantDTO> {
    if (!input.userId) {
      throw new BadRequestError("Usuário não informado.");
    }

    const [existingParticipant, trip] = await Promise.all([
      this.participantRepository.findById(input.participantId),
      this.tripRepository.findByTripAndUserId(input.tripId, input.userId),
    ]);

    if (!existingParticipant) {
      throw new NotFoundError("Participante não encontrado.");
    }

    if (!trip || !trip.isOwner) {
      throw new BadRequestError(
        "Somente o proprietário da viagem pode atualizar os participantes.",
      );
    }

    const participantDomain = ParticipantMapper.toDomain(existingParticipant);
    participantDomain.update(input.name ?? null, input.email);

    const result = await this.participantRepository.update({
      participantId: participantDomain.id,
      tripId: participantDomain.tripId,
      email: input.email,
      name: input.name,
    });

    return result;
  }
}
