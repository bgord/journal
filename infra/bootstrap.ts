import { createSystemAdapters } from "+infra/adapters/system";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "+infra/i18n";
import { ResponseCache } from "./response-cache";

export async function bootstrap(Env: EnvironmentType) {
  const System = createSystemAdapters(Env);

  return { Env, Adapters: { System }, Tools: { I18nConfig, ResponseCache } };
}
