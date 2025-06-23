import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { HTTPException } from "hono/http-exception";
import type { TimingVariables } from "hono/timing";

export * from "./anthropic-ai-client";
export * from "./basic-auth-shield";
export * from "./db";
export * from "./env";
export * from "./event-bus";
export * from "./event-store";
export * from "./healthcheck";
export * from "./i18n";
export * from "./logger";
export * from "./mailer";
export * from "./open-ai-client";
export * from "./prerequisites";
export * from "./register-event-handlers";
export * as Schema from "./schema";

export const requestTimeoutError = new HTTPException(408, {
  message: "request_timeout_error",
});

export type Variables = TimingVariables & bg.TimeZoneOffsetVariables & bg.ContextVariables & bg.EtagVariables;

export const BODY_LIMIT_MAX_SIZE = new tools.Size({
  value: 128,
  unit: tools.SizeUnit.kB,
}).toBytes();
