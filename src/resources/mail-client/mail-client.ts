import nodemailer from "nodemailer";
import type SESTransport from "nodemailer/lib/ses-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

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
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    return transporter;
  }

  getMailUrl(info: SendEmailProps): string | false {
    return nodemailer.getTestMessageUrl(info);
  }
}
