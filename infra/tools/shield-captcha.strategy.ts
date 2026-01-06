import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldCaptcha(Env: EnvironmentType): bg.ShieldStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldHcaptchaLocalStrategy(Env.HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldHcaptchaStrategy(Env.HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopStrategy(),
  }[Env.type];
}
