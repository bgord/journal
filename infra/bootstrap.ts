import { createSystemAdapters } from "+infra/adapters/system";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "+infra/i18n";
import { createPrerequisites } from "+infra/prerequisites";
import { ResponseCache } from "./response-cache";

export async function bootstrap(Env: EnvironmentType) {
  const System = createSystemAdapters(Env);

  const prerequisites = createPrerequisites(Env, { ...System, Jobs });

  return { Env, Adapters: { System }, Tools: { Prerequisites, I18nConfig, ResponseCache } };
}
