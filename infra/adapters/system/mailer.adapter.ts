import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort };

export async function createMailer(Env: EnvironmentType, deps: Dependencies): Promise<bg.MailerPort> {
  const MailerNoop = new bg.MailerNoopAdapter();
  const MailerNoopWithLogger = new bg.MailerWithLoggerAdapter({ inner: MailerNoop, ...deps });
  const MailerSmtp = await bg.MailerSmtpAdapter.build({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: MailerNoopWithLogger,
    [bg.NodeEnvironmentEnum.test]: MailerNoop,
    [bg.NodeEnvironmentEnum.staging]: MailerNoopWithLogger,
    [bg.NodeEnvironmentEnum.production]: new bg.MailerWithLoggerAdapter({ inner: MailerSmtp, ...deps }),
  }[Env.type];
}
