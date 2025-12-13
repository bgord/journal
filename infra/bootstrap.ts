import { createAuthAdapter } from "+infra/adapters/ai";
import { createAuthAdapters } from "+infra/adapters/auth";
import { createHistoryAdapters } from "+infra/adapters/history";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createPublishingAdapters } from "+infra/adapters/publishing";
import { createSystemAdapters } from "+infra/adapters/system";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "+infra/i18n";
import { createPrerequisites } from "+infra/prerequisites";
import { createJobs } from "./jobs";
import { ResponseCache } from "./response-cache";

export async function bootstrap(Env: EnvironmentType) {
  const System = createSystemAdapters(Env);
  const Preferences = createPreferencesAdapters();
  const Auth = createAuthAdapters();
  const AI = createAuthAdapter(Env, System);
  const History = createHistoryAdapters(System);
  const Publishing = createPublishingAdapters(System);

  const Jobs = createJobs(System);

  const prerequisites = createPrerequisites(Env, { ...System, Jobs });

  return {
    Env,
    Adapters: { Auth, System, Preferences, AI, History, Publishing },
    Tools: { prerequisites, I18nConfig, ResponseCache },
  };
}
