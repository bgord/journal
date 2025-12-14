import { createAuthAdapter } from "+infra/adapters/ai";
import { createAuthAdapters } from "+infra/adapters/auth";
import { createEmotionsAdapters } from "+infra/adapters/emotions";
import { createHistoryAdapters } from "+infra/adapters/history";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createPublishingAdapters } from "+infra/adapters/publishing";
import { createSystemAdapters } from "+infra/adapters/system";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "+infra/i18n";
import { createJobs } from "+infra/jobs";
import { createPrerequisites } from "+infra/prerequisites";
import { ResponseCache } from "+infra/response-cache";

export async function bootstrap(Env: EnvironmentType) {
  const System = createSystemAdapters(Env);

  const AI = createAuthAdapter(Env, System);
  const Auth = createAuthAdapters();
  const Emotions = createEmotionsAdapters(Env, System);
  const History = createHistoryAdapters(System);
  const Preferences = createPreferencesAdapters();
  const Publishing = createPublishingAdapters(System);

  const Jobs = createJobs(System);

  const prerequisites = createPrerequisites(Env, { ...System, Jobs });

  return {
    Env,
    Adapters: { AI, Auth, Emotions, History, Preferences, Publishing, System },
    Tools: { prerequisites, I18nConfig, ResponseCache },
  };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
