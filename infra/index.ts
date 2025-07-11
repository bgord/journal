import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { HTTPException } from "hono/http-exception";
import type { TimingVariables } from "hono/timing";

export const requestTimeoutError = new HTTPException(408, {
  message: "request_timeout_error",
});

export type Variables = TimingVariables & bg.TimeZoneOffsetVariables & bg.ContextVariables & bg.EtagVariables;

export const BODY_LIMIT_MAX_SIZE = new tools.Size({
  value: 128,
  unit: tools.SizeUnit.kB,
}).toBytes();
