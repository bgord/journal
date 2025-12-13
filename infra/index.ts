import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { TimingVariables } from "hono/timing";
import type { AuthVariables } from "./auth";
import type { I18nVariables } from "./i18n";

type Variables = TimingVariables &
  bg.TimeZoneOffsetVariables &
  bg.ContextVariables &
  bg.EtagVariables &
  I18nVariables &
  AuthVariables;

export type HonoConfig = { Variables: Variables; startup: tools.Stopwatch };

export const BODY_LIMIT_MAX_SIZE = tools.Size.fromKb(128).toBytes();

export const IDLE_TIMEOUT = tools.Duration.Seconds(10).seconds;
