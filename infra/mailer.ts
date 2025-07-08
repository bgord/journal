import { Env } from "+infra/env";
import * as bg from "@bgord/bun";

export const Mailer = new bg.Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});
