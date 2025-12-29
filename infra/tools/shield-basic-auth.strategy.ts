import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldBasicAuth(Env: EnvironmentType): bg.ShieldStrategy {
  return new bg.ShieldBasicAuthStrategy({
    username: Env.BASIC_AUTH_USERNAME,
    password: Env.BASIC_AUTH_PASSWORD,
  });
}
