import nodemailer from "nodemailer";
import type SESTransport from "nodemailer/lib/ses-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { env } from "@/config/env";

type SentMessageInfoProps = SESTransport.SentMessageInfo;
type SentMessageInfoType = SMTPTransport.SentMessageInfo;

export type SendEmailProps = SentMessageInfoProps | SentMessageInfoType;

export interface IMailClient {
  getMailUrl(info: SendEmailProps): string | false;
  getMailClient(): Promise<
    nodemailer.Transporter<SentMessageInfoType, SMTPTransport.Options>
  >;
}

export class EmailClient implements IMailClient {
  async getMailClient() {
    const transportOptions: SMTPTransport.Options = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD,
      },
    };

    return nodemailer.createTransport(transportOptions);
  }

  getMailUrl(info: SendEmailProps): string | false {
    return nodemailer.getTestMessageUrl(info);
  }
}
