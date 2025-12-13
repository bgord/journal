import type * as bg from "@bgord/bun";
import type { TimingVariables } from "hono/timing";
import type { AuthVariables } from "./auth";
import type { I18nVariables } from "./i18n";

export type Config = {
  Variables: TimingVariables &
    bg.TimeZoneOffsetVariables &
    bg.ContextVariables &
    bg.EtagVariables &
    I18nVariables &
    AuthVariables;
};
