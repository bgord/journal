import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const HCAPTCHA_SECRET_KEY = Env.HCAPTCHA_SECRET_KEY as bg.HCaptchaSecretKeyType;

export const CaptchaShield = {
  [bg.NodeEnvironmentEnum.local]: new bg.CaptchaShieldHcaptchaLocal(HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.test]: new bg.CaptchaShieldNoop(),
  [bg.NodeEnvironmentEnum.staging]: new bg.CaptchaShieldHcaptcha(HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.production]: new bg.CaptchaShieldHcaptcha(HCAPTCHA_SECRET_KEY),
}[Env.type];
