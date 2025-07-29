import { Env, MailerAdapter } from "+infra/env";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";

export const Mailer = {
  [MailerAdapter.smtp]: new bg.SmtpMailerAdapter({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  }),
  [MailerAdapter.noop]: new bg.NoopMailerAdapter(logger),
}[Env.MAILER_ADAPTER];
