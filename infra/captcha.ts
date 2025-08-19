import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

export const CaptchaShield = {
  [bg.NodeEnvironmentEnum.local]: new bg.CaptchaShieldHcaptchaLocal(Env.HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.test]: new bg.CaptchaShieldNoop(),
  [bg.NodeEnvironmentEnum.staging]: new bg.CaptchaShieldHcaptcha(Env.HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.production]: new bg.CaptchaShieldHcaptcha(Env.HCAPTCHA_SECRET_KEY),
}[Env.type];
