import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { TimingVariables } from "hono/timing";
import type { AuthVariables } from "./auth";
import type { I18nVariables } from "./i18n";

type Variables = TimingVariables &
  bg.TimeZoneOffsetVariables &
  bg.ContextVariables &
  bg.EtagVariables &
  I18nVariables &
  AuthVariables;

export type Config = { Variables: Variables; startup: tools.Stopwatch };
