import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { Env, MailerAdapter } from "+infra/env";

export const Mailer = {
  [MailerAdapter.smtp]: new bg.MailerSmtpAdapter({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  }),
  [MailerAdapter.noop]: new bg.MailerNoopAdapter(Adapters.Logger),
}[Env.MAILER_ADAPTER];
