import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldCaptcha(Env: EnvironmentType): bg.ShieldPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldCaptchaHcaptchaLocalAdapter(Env.HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldCaptchaHcaptchaAdapter(Env.HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopAdapter(),
  }[Env.type];
}
