import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldCaptcha(Env: EnvironmentType): bg.MiddlewareHonoPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.MiddlewareHonoNoopAdapter(),
  }[Env.type];
}
