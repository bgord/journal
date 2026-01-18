import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldCaptcha(Env: EnvironmentType): bg.ShieldStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopStrategy(),
  }[Env.type];
}
