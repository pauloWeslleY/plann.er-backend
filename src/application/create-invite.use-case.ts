import nodemailer from "nodemailer";

import { env } from "@/config/env";
import { type DateJS } from "@/resources/date-js/datejs";
import { NotFoundError } from "@/resources/errors/app-error";
import { type MailClient } from "@/resources/mail-client/mail-client";

import { type CreateInviteDTO } from "./dto/invite.dto";
import { type CreateInvitePort } from "./ports/create-invite.port";
import { type ParticipantRepositoryPort } from "./ports/participant-repository.port";
import { type TripRepositoryPort } from "./ports/trip-repository.port";

export class CreateInviteUseCase implements CreateInvitePort {
  constructor(
    private readonly tripRepository: TripRepositoryPort,
    private readonly participantRepository: ParticipantRepositoryPort,
    private readonly service: {
      date: DateJS;
      mailClient: MailClient;
    },
  ) {}

  async execute(input: CreateInviteDTO): Promise<{ participantId: string }> {
    const trip = await this.tripRepository.findById(input.tripId);

    if (!trip) {
      throw new NotFoundError("Viagem não encontrada.");
    }

    const participant = await this.participantRepository.create({
      tripId: trip.id,
      participants: [
        {
          email: input.email,
        },
      ],
    });

    const formattedStartDate = this.service.date
      .dayjs(trip.startsAt)
      .format("LL");

    const formattedEndDate = this.service.date.dayjs(trip.endsAt).format("LL");
    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

    const mail = await this.service.mailClient.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "oi@plann.er",
      },
      to: participant[0].email,
      subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
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

    console.log(nodemailer.getTestMessageUrl(mail));

    return {
      participantId: participant[0].id,
    };
  }
}
