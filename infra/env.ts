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
    AI_CLIENT_ADAPTER: z.enum(AiClientAdapter),
    BETTER_AUTH_SECRET: z.string().length(32).trim(),
    BETTER_AUTH_URL: tools.UrlWithoutSlash,
    HCAPTCHA_SECRET_KEY: bg.HCaptchaSecretKey,
    SIGNUP_ENABLED: tools.FeatureFlagValue,
  })
  .strip();

export type EnvironmentType = bg.EnvironmentResultType<typeof Schema>;

export const MasterKeyPath = tools.FilePathAbsolute.fromString("/etc/bgord/journal/master.key");
export const SecretsPath = tools.FilePathAbsolute.fromString("/var/www/journal/secrets.enc");

export async function createEnvironmentLoader(): Promise<bg.EnvironmentLoaderPort<typeof Schema>> {
  const type = bg.NodeEnvironment.parse(process.env.NODE_ENV);

  const CryptoKeyProvider = new bg.CryptoKeyProviderFileAdapter(MasterKeyPath);
  const Encryption = new bg.EncryptionBunAdapter({ CryptoKeyProvider });

  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Hours(1) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  const HashContent = new bg.HashContentSha256BunAdapter();

  const EnvironmentLoaderProcessSafe = new bg.EnvironmentLoaderProcessSafeAdapter(
    process.env,
    { type, Schema },
    { CacheResolver, HashContent },
  );

  return {
    [bg.NodeEnvironmentEnum.local]: EnvironmentLoaderProcessSafe,
    [bg.NodeEnvironmentEnum.test]: new bg.EnvironmentLoaderProcessAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.staging]: EnvironmentLoaderProcessSafe,
    [bg.NodeEnvironmentEnum.production]: new bg.EnvironmentLoaderEncryptedAdapter(
      { type, Schema, path: SecretsPath },
      { Encryption },
    ),
  }[type];
}
