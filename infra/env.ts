import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export enum AiClientAdapter {
  anthropic = "anthropic",
  open_ai = "open_ai",
  noop = "noop",
}

export enum MailerAdapter {
  smtp = "smtp",
  noop = "noop",
}

const EnvironmentSchema = z
  .object({
    PORT: bg.Port,
    LOGS_LEVEL: z.enum(bg.LogLevelEnum),
    SMTP_HOST: bg.SmtpHost,
    SMTP_PORT: bg.SmtpPort,
    SMTP_USER: bg.SmtpUser,
    SMTP_PASS: bg.SmtpPass,
    EMAIL_FROM: bg.EmailFrom,
    TZ: bg.TimezoneUtc,
    BASIC_AUTH_USERNAME: bg.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.BasicAuthPassword,
    OPEN_AI_API_KEY: z.string().min(1).max(256).trim(),
    ANTHROPIC_AI_API_KEY: z.string().min(1).max(256).trim(),
    AXIOM_API_TOKEN: z.string().length(41),
    AI_CLIENT_ADAPTER: z.enum(AiClientAdapter),
    MAILER_ADAPTER: z.enum(MailerAdapter),
    BETTER_AUTH_SECRET: z.string().length(32).trim(),
    BETTER_AUTH_URL: z.url().trim(),
    HCAPTCHA_SECRET_KEY: z.string().trim(),
    SIGNUP_ENABLED: tools.FeatureFlagValue,
  })
  .strip();

export const Env = new bg.EnvironmentValidator({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load(process.env);
