import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { Logger } from "+infra/adapters/logger.adapter";
import { Env, MailerAdapter } from "+infra/env";

const smtpMailer = new bg.MailerSmtpAdapter({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export const Mailer = {
  [MailerAdapter.smtp]: new bg.MailerSmtpWithLoggerAdapter({ smtpMailer: smtpMailer, logger: Logger }),
  [MailerAdapter.noop]: new bg.MailerNoopAdapter(Adapters.Logger),
}[Env.MAILER_ADAPTER];
