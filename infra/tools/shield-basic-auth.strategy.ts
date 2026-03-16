import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createShieldBasicAuth(Env: EnvironmentResultType): bg.MiddlewareHonoPort {
  return new bg.ShieldBasicAuthHonoStrategy({
    username: Env.BASIC_AUTH_USERNAME,
    password: Env.BASIC_AUTH_PASSWORD,
  });
}
