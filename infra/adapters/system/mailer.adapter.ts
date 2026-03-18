import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  Logger: bg.LoggerPort;
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
};

export async function createMailer(Env: EnvironmentResultType, deps: Dependencies): Promise<bg.MailerPort> {
  const MailerNoop = new bg.MailerNoopAdapter();

  const MailerSmtp = await bg.MailerSmtpAdapter.build({
    SMTP_HOST: Env.SMTP_HOST,
    SMTP_PORT: Env.SMTP_PORT,
    SMTP_USER: Env.SMTP_USER,
    SMTP_PASS: Env.SMTP_PASS,
  });

  const local = bg.MailerBuilder.of(MailerNoop).withLogger(deps).build();

  const production = bg.MailerBuilder.of(MailerSmtp)
    .withTimeout({ timeout: tools.Duration.Seconds(5) }, deps)
    .withRetry(
      {
        retry: {
          max: tools.Int.positive(3),
          backoff: new bg.RetryBackoffLinearStrategy(tools.Duration.Seconds(1)),
        },
      },
      deps,
    )
    .withLogger(deps)
    .build();

  return {
    [bg.NodeEnvironmentEnum.local]: local,
    [bg.NodeEnvironmentEnum.test]: MailerNoop,
    [bg.NodeEnvironmentEnum.staging]: MailerNoop,
    [bg.NodeEnvironmentEnum.production]: production,
  }[Env.type];
}
