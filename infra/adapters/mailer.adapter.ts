import * as bg from "@bgord/bun";
import { Env, MailerAdapter } from "+infra/env";
import { logger } from "+infra/logger";

export const Mailer = {
  [MailerAdapter.smtp]: new bg.MailerSmtpAdapter({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  }),
  [MailerAdapter.noop]: new bg.MailerNoopAdapter(logger),
}[Env.MAILER_ADAPTER];
