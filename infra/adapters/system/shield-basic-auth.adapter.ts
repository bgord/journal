import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldBasicAuth(Env: EnvironmentType): bg.ShieldPort {
  return new bg.ShieldBasicAuthAdapter({
    username: Env.BASIC_AUTH_USERNAME,
    password: Env.BASIC_AUTH_PASSWORD,
  });
}
