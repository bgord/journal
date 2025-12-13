import { createSystemAdapters } from "+infra/adapters/system";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "+infra/i18n";
import { createPrerequisites } from "+infra/prerequisites";
import { createJobs } from "./jobs";
import { ResponseCache } from "./response-cache";

export async function bootstrap(Env: EnvironmentType) {
  const System = createSystemAdapters(Env);

  const Jobs = createJobs(System);

  const prerequisites = createPrerequisites(Env, { ...System, Jobs });

  return { Env, Adapters: { System }, Tools: { prerequisites, I18nConfig, ResponseCache } };
}
