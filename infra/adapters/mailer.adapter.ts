import * as bg from "@bgord/bun";
import { Logger } from "+infra/adapters/logger.adapter";
import { Env } from "+infra/env";

const MailerSmtp = new bg.MailerSmtpAdapter({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export const Mailer = {
  [bg.NodeEnvironmentEnum.local]: new bg.MailerNoopAdapter({ Logger }),
  [bg.NodeEnvironmentEnum.test]: new bg.MailerNoopAdapter({ Logger }),
  [bg.NodeEnvironmentEnum.staging]: new bg.MailerNoopAdapter({ Logger }),
  [bg.NodeEnvironmentEnum.production]: new bg.MailerSmtpWithLoggerAdapter({ Logger, MailerSmtp }),
}[Env.type];
