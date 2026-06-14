import { env } from "@/config/env";
import { type IDateService } from "@/resources/date-js/datejs";
import { BadRequestError, NotFoundError } from "@/resources/errors/app-error";
import { type IMailClient } from "@/resources/mail-client/mail-client";

import { TripStatus } from "./dto/trip.dto";
import { type ConfirmTripPort } from "./ports/confirm-trip.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class ConfirmTripUseCase implements ConfirmTripPort {
  private readonly tripRepository: TripRepositoryPort;
  private readonly participantRepository: ParticipantRepositoryPort;
  private readonly dateService: IDateService;
  private readonly mail: IMailClient;

  constructor(
    protected readonly dependecies: {
      tripRepository: TripRepositoryPort;
      participantRepository: ParticipantRepositoryPort;
      date: IDateService;
      mail: IMailClient;
    },
  ) {
    this.tripRepository = dependecies.tripRepository;
    this.participantRepository = dependecies.participantRepository;
    this.dateService = dependecies.date;
    this.mail = dependecies.mail;
  }

  async execute(input: { tripId: string }): Promise<{ url: string }> {
    const trip = await this.tripRepository.findUniqueTripAndOwner(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    if (trip.status === TripStatus.CANCELLED) {
      throw new BadRequestError(
        "Não é possível confirmar uma viagem cancelada.",
      );
    }

    if (trip.isConfirmed) {
      return {
        url: `${env.WEB_BASE_URL}/trips/${trip.id}`,
      };
    }

    await this.tripRepository.save({
      isConfirmed: true,
      tripId: trip.id,
    });

    const tripDate = {
      startsAt: this.dateService.date(trip.startsAt),
      endsAt: this.dateService.date(trip.endsAt),
    };

    if (tripDate.startsAt.isBefore(new Date())) {
      throw new BadRequestError(
        "Começo da viagem deve ser em uma data futura.",
      );
    }

    if (tripDate.endsAt.isBefore(tripDate.startsAt)) {
      throw new BadRequestError("Fim da viagem deve ser após o início.");
    }

    const formattedStartDate = tripDate.startsAt.format("LL");
    const formattedEndDate = tripDate.endsAt.format("LL");
    const participants = await this.participantRepository.findByTripId(trip.id);
    const mailClient = await this.mail.getMailClient();

    await Promise.all(
      participants?.map(async (participant) => {
        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm?tripId=${trip.id}`;

        await mailClient.sendMail({
          from: {
            name: "Equipe plann.er",
            address: "oi@plann.er",
          },
          to: participant.email,
          subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
          html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
            <p></p>
            <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
            <p></p>
            <p>
              <a href="${confirmationLink}">Confirmar viagem</a>
            </p>
            <p></p>
            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
          </div>
        `.trim(),
        });
      }),
    );

    return {
      url: `${env.WEB_BASE_URL}/trips/${trip.id}`,
    };
  }
}
