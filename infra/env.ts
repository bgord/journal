import { AiClientEnum } from "+emotions/services/ai-client";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

// TODO: Extract known API keys to bgord/bun schema
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
    AI_CLIENT: z.enum(AiClientEnum),
    FF_AI_CLIENT_REAL_RESPONSE: tools.FeatureFlagValue,
    FF_MAILER_DISABLED: tools.FeatureFlagValue,
    BETTER_AUTH_SECRET: z.string().length(32).trim(),
    BETTER_AUTH_URL: z.url().trim(),
  })
  .strip();

export const Env = new bg.EnvironmentValidator<z.infer<typeof EnvironmentSchema>>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
