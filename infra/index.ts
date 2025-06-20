import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { HTTPException } from "hono/http-exception";
import type { TimingVariables } from "hono/timing";
import { Env } from "./env";
import { logger } from "./logger";
import { Mailer } from "./mailer";

export * from "./basic-auth-shield";
export * from "./db";
export * from "./env";
export * from "./event-store";
export * from "./i18n";
export * from "./logger";
export * from "./mailer";

export const requestTimeoutError = new HTTPException(408, {
  message: "request_timeout_error",
});

export type Variables = TimingVariables & bg.TimeZoneOffsetVariables & bg.ContextVariables & bg.EtagVariables;

export const BODY_LIMIT_MAX_SIZE = new tools.Size({
  value: 128,
  unit: tools.SizeUnit.kB,
}).toBytes();

/** @public */
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
