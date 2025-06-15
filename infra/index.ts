import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { basicAuth } from "hono/basic-auth";
import { HTTPException } from "hono/http-exception";
import type { TimingVariables } from "hono/timing";
import { Env } from "./env";
import { logger } from "./logger";
import { Mailer } from "./mailer";
import { SupportedLanguages } from "./supported-languages";

export * from "./env";
export * from "./mailer";
export * from "./logger";
export * from "./supported-languages";

export const I18nConfig: bg.I18nConfigType = {
  supportedLanguages: SupportedLanguages,
  defaultLanguage: SupportedLanguages.en,
};

export const requestTimeoutError = new HTTPException(408, {
  message: "request_timeout_error",
});

export type Variables = TimingVariables & bg.TimeZoneOffsetVariables & bg.ContextVariables & bg.EtagVariables;

export const BODY_LIMIT_MAX_SIZE = new tools.Size({
  value: 128,
  unit: tools.SizeUnit.kB,
}).toBytes();

export const BasicAuthShield = basicAuth({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

export const ApiKeyShield = new bg.ApiKeyShield({ API_KEY: Env.API_KEY });

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteTimezoneUTC({
    label: "timezone",
    timezone: tools.Timezone.parse(Env.TZ),
  }),
  new bg.PrerequisiteRAM({
    label: "RAM",
    enabled: Env.type !== bg.NodeEnvironmentEnum.local,
    minimum: new tools.Size({ unit: tools.SizeUnit.MB, value: 128 }),
  }),
  new bg.PrerequisiteSpace({
    label: "disk-space",
    minimum: new tools.Size({ unit: tools.SizeUnit.MB, value: 512 }),
  }),
  new bg.PrerequisiteNode({
    label: "node",
    version: tools.PackageVersion.fromStringWithV("v24.1.0"),
  }),
  new bg.PrerequisiteBun({
    label: "bun",
    version: tools.PackageVersion.fromString("1.2.15"),
    current: Bun.version,
  }),
  new bg.PrerequisiteMemory({
    label: "memory-consumption",
    maximum: new tools.Size({ value: 300, unit: tools.SizeUnit.MB }),
  }),
  new bg.PrerequisiteLogFile({
    label: "log-file",
    logger,
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
];

export const healthcheck = [
  new bg.PrerequisiteSelf({ label: "self" }),
  new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity" }),
  new bg.PrerequisiteMailer({ label: "nodemailer", mailer: Mailer }),
  ...prerequisites.filter((prerequisite) => prerequisite.config.label !== "port"),
];
