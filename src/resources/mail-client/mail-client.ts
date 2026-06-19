import nodemailer from "nodemailer";
import type SESTransport from "nodemailer/lib/ses-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

type SentMessageInfoProps = SESTransport.SentMessageInfo;
type SentMessageInfoType = SMTPTransport.SentMessageInfo;

export type SendEmailProps = SentMessageInfoProps | SentMessageInfoType;

export interface IMailClient {
  getMailUrl(info: SendEmailProps): string | false;
  getMailClient(): Promise<
    nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  >;
}

export class EmailClient implements IMailClient {
  async getMailClient() {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    return transporter;
  }

  getMailUrl(info: SendEmailProps): string | false {
    return nodemailer.getTestMessageUrl(info);
  }
}

export async function getMailClient() {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return transporter;
}

export function getTestMessageUrl(mailOptions: SendEmailProps) {
  return nodemailer.getTestMessageUrl(mailOptions);
}

export type MailClient = Awaited<ReturnType<typeof getMailClient>>;
