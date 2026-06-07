import { type IDateService } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";

import { type TripDTO, type UpdateTripDTO } from "./dto/trip.dto";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type UpdateTripPort } from "./ports/update-trip.port";

export class UpdateTripUseCase implements UpdateTripPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly dateService: IDateService,
  ) {}

  async execute(input: UpdateTripDTO): Promise<{ trip: TripDTO }> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (!trip.canBeEdited()) {
      throw new BadRequestError(
        "Viagem não pode ser editada no status cancelado.",
      );
    }

    const tripDates = {
      startsAt: this.dateService.date(input.startsAt),
      endsAt: this.dateService.date(input.endsAt),
    };

    if (tripDates.startsAt.isBefore(new Date())) {
      throw new BadRequestError(
        "Começo da viagem deve ser em uma data futura.",
      );
    }

    if (tripDates.endsAt.isBefore(tripDates.startsAt)) {
      throw new BadRequestError("Fim da viagem deve ser após o início.");
    }

    trip.update(
      input.destination,
      tripDates.startsAt.toDate(),
      tripDates.endsAt.toDate(),
    );

    const updatedTrip = await this.tripRepository.update(trip);

    return {
      trip: updatedTrip,
    };
  }
}
