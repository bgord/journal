import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort };

export function createMailer(Env: EnvironmentType, deps: Dependencies): bg.MailerPort {
  const MailerSmtp = new bg.MailerSmtpAdapter({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.MailerNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.test]: new bg.MailerNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.staging]: new bg.MailerNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.MailerSmtpWithLoggerAdapter({ ...deps, MailerSmtp }),
  }[Env.type];
}
