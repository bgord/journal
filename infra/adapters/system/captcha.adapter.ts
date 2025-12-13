import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createShieldCaptcha(Env: EnvironmentType): bg.ShieldPort {
  // TODO: Fix type casting
  const HCAPTCHA_SECRET_KEY = Env.HCAPTCHA_SECRET_KEY as bg.HCaptchaSecretKeyType;

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldCaptchaHcaptchaLocalAdapter(HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldCaptchaHcaptchaAdapter(HCAPTCHA_SECRET_KEY),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopAdapter(),
  }[Env.type];
}
