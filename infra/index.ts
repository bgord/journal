import type * as bg from "@bgord/bun";
import type { TimingVariables } from "hono/timing";
import type { I18nVariables } from "+infra/tools/i18n";
import type { AuthVariables } from "+infra/tools/shield-auth.strategy";

export type Config = {
  Variables: TimingVariables &
    bg.TimeZoneOffsetVariables &
    bg.ContextVariables &
    bg.EtagVariables &
    I18nVariables &
    AuthVariables;
};
