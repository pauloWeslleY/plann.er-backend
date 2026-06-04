import { TripMapper } from "@/adapters/output/mappers/trip.mapper";
import { type DateJS } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { type UpdateTripDTO } from "./dto/trip.dto";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type UpdateTripPort } from "./ports/update-trip.port";

export class UpdateTripUseCase implements UpdateTripPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly date: DateJS,
  ) {}

  async execute(input: UpdateTripDTO): Promise<{ tripId: string }> {
    const existingTrips = await this.tripRepository.findById(input.tripId);

    if (!existingTrips) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    const tripDates = {
      startsAt: this.date.dayjs(input.startsAt),
      endsAt: this.date.dayjs(input.endsAt),
    };

    if (tripDates.startsAt.isBefore(new Date())) {
      throw new BadRequestError(
        "Começo da viagem deve ser em uma data futura.",
      );
    }

    if (tripDates.endsAt.isBefore(tripDates.startsAt)) {
      throw new BadRequestError("Fim da viagem deve ser após o início.");
    }

    const tripDomain = TripMapper.toDomain(existingTrips);

    tripDomain.update(
      input.destination,
      tripDates.startsAt.toDate(),
      tripDates.endsAt.toDate(),
    );

    await this.tripRepository.update(tripDomain);

    return {
      tripId: tripDomain.id,
    };
  }
}
