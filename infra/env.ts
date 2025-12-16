import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export enum AiClientAdapter {
  anthropic = "anthropic",
  open_ai = "open_ai",
  noop = "noop",
}

const OPEN_AI_API_KEY = z.string().min(1).max(256).trim().brand("OPEN_AI_API_KEY");
export type OpenAiApiKeyType = z.infer<typeof OPEN_AI_API_KEY>;

const ANTHROPIC_AI_API_KEY = z.string().min(1).max(256).trim().brand("ANTHROPIC_AI_API_KEY");
export type AnthropicAiApiKey = z.infer<typeof ANTHROPIC_AI_API_KEY>;

export const Schema = z
  .object({
    PORT: bg.Port,
    LOGS_LEVEL: z.enum(bg.LogLevelEnum),
    SMTP_HOST: bg.SmtpHost,
    SMTP_PORT: bg.SmtpPort,
    SMTP_USER: bg.SmtpUser,
    SMTP_PASS: bg.SmtpPass,
    EMAIL_FROM: tools.Email,
    TZ: bg.TimezoneUtc,
    BASIC_AUTH_USERNAME: bg.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.BasicAuthPassword,
    OPEN_AI_API_KEY,
    ANTHROPIC_AI_API_KEY,
    AXIOM_API_TOKEN: z.string().length(41),
    AI_CLIENT_ADAPTER: z.enum(AiClientAdapter),
    BETTER_AUTH_SECRET: z.string().length(32).trim(),
    BETTER_AUTH_URL: tools.UrlWithoutSlash,
    HCAPTCHA_SECRET_KEY: bg.HCaptchaSecretKey,
    SIGNUP_ENABLED: tools.FeatureFlagValue,
  })
  .strip();

export type EnvironmentType = bg.EnvironmentResultType<typeof Schema>;

export async function createEnvironmentLoader(): Promise<bg.EnvironmentLoaderPort<typeof Schema>> {
  const type = bg.NodeEnvironment.parse(process.env.NODE_ENV);

  // TODO: Add to prereqs
  const MasterKeyPath = tools.FilePathAbsolute.fromString("/etc/bgord/journal/master.key");
  const CryptoKeyProvider = new bg.CryptoKeyProviderFileAdapter(MasterKeyPath);

  const Encryption = new bg.EncryptionBunAdapter({ CryptoKeyProvider });

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.EnvironmentLoaderProcessSafeAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.test]: new bg.EnvironmentLoaderProcessAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.staging]: new bg.EnvironmentLoaderProcessSafeAdapter(
      { type, Schema },
      process.env,
    ),
    [bg.NodeEnvironmentEnum.production]: new bg.EnvironmentLoaderEncryptedAdapter(
      // TODO: Add to prereqs
      { type, Schema, path: tools.FilePathAbsolute.fromString("/var/www/journal/secrets.enc") },
      { Encryption },
    ),
  }[type];
}
