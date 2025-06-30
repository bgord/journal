import * as bg from "@bgord/bun";
import { z } from "zod/v4";

const EnvironmentSchema = z
  .object({
    PORT: bg.Port,
    LOGS_LEVEL: bg.LogLevel,
    SMTP_HOST: bg.SmtpHost,
    SMTP_PORT: bg.SmtpPort,
    SMTP_USER: bg.SmtpUser,
    SMTP_PASS: bg.SmtpPass,
    EMAIL_FROM: bg.EmailFrom,
    EMAIL_TO: bg.EmailTo,
    TZ: bg.TimezoneUtc,
    BASIC_AUTH_USERNAME: bg.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.BasicAuthPassword,
    OPEN_AI_API_KEY: z.string().min(1).max(256).trim(),
    ANTHROPIC_AI_API_KEY: z.string().min(1).max(256).trim(),
    AXIOM_API_TOKEN: z.string().length(41),
    AXIOM_DATASET_NAME: z.string().min(1).max(256).trim(),
  })
  .strip();

export const Env = new bg.EnvironmentValidator<z.infer<typeof EnvironmentSchema>>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
