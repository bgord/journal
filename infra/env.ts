import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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
    API_KEY: tools.ApiKey,
  })
  .strip();

export const Env = new bg.EnvironmentValidator<z.infer<typeof EnvironmentSchema>>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
