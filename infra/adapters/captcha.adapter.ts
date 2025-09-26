import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const HCAPTCHA_SECRET_KEY = Env.HCAPTCHA_SECRET_KEY as bg.HCaptchaSecretKeyType;

export const CaptchaShield = {
  [bg.NodeEnvironmentEnum.local]: new bg.ShieldCaptchaHcaptchaLocal(HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.test]: new bg.ShieldCaptchaNoop(),
  [bg.NodeEnvironmentEnum.staging]: new bg.ShieldCaptchaHcaptcha(HCAPTCHA_SECRET_KEY),
  [bg.NodeEnvironmentEnum.production]: new bg.ShieldCaptchaNoop(),
}[Env.type];
