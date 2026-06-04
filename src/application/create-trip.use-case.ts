import nodemailer from "nodemailer";
import { v7 as uuidv7 } from "uuid";

import { env } from "@/config/env";
import { type DateJS } from "@/resources/date-js/datejs";
import { BadRequestError } from "@/resources/errors/app-error";
import { type MailClient } from "@/resources/mail-client/mail-client";

import { Trip } from "./core/trip.entity";
import { type CreateTripDTO } from "./dto/trip.dto";
import { type CreateTripPort } from "./ports/create-trip.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";
import { type IUnitOfWorkTransaction } from "./ports/unit-of-work-transaction.port";

export class CreateTripUseCase implements CreateTripPort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly createTripServiceTransaction: IUnitOfWorkTransaction,
    private readonly service: {
      date: DateJS;
      mailClient: MailClient;
    },
  ) {}

  async execute(
    input: CreateTripDTO,
  ): Promise<{ tripId: string; emailSent: boolean }> {
    const existingTrips = await this.tripRepository.findByDestination(
      input.destination,
    );

    if (existingTrips) {
      throw new BadRequestError("Viagem já existe para este destino.");
    }

    if (!input.userId) {
      throw new BadRequestError(
        "Usuário deve estar autenticado para criar uma viagem.",
      );
    }

    const tripDate = {
      startsAt: this.service.date.dayjs(input.startsAt),
      endsAt: this.service.date.dayjs(input.endsAt),
    };

    if (tripDate.startsAt.isBefore(new Date())) {
      throw new BadRequestError(
        "Começo da viagem deve ser em uma data futura.",
      );
    }

    if (tripDate.endsAt.isBefore(tripDate.startsAt)) {
      throw new BadRequestError("Fim da viagem deve ser após o início.");
    }

    const tripId = uuidv7();

    const trip = Trip.create(tripId, {
      destination: input.destination,
      startsAt: tripDate.startsAt.toDate(),
      endsAt: tripDate.endsAt.toDate(),
      userId: input.userId,
    });

    await this.createTripServiceTransaction.transaction({
      tripId: trip.id,
      startsAt: tripDate.startsAt.toDate(),
      endsAt: tripDate.endsAt.toDate(),
      destination: input.destination,
      userId: input.userId,
      ownerName: input.ownerName,
      ownerEmail: input.ownerEmail,
      emailsToInvite: input.emailsToInvite,
    });

    const formattedStartDate = tripDate.startsAt.format("LL");
    const formattedEndDate = tripDate.endsAt.format("LL");
    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

    const mail = await this.service.mailClient.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "oi@plann.er",
      },
      to: {
        name: input.ownerName,
        address: input.ownerEmail,
      },
      subject: `Confirme sua viagem para ${input.destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${input.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim(),
    });

    const emailPreviewUrl = nodemailer.getTestMessageUrl(mail);

    return {
      tripId: trip.id,
      emailSent: !!emailPreviewUrl,
    };
  }
}
