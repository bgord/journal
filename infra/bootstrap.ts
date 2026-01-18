import { createAuthAdapter } from "+infra/adapters/ai";
import { createAuthAdapters } from "+infra/adapters/auth";
import { createEmotionsAdapters } from "+infra/adapters/emotions";
import { createHistoryAdapters } from "+infra/adapters/history";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createPublishingAdapters } from "+infra/adapters/publishing";
import { createSystemAdapters } from "+infra/adapters/system";
import { createEnvironmentLoader } from "+infra/env";
import { createTools } from "+infra/tools";

export async function bootstrap() {
  const EnvironmentLoader = await createEnvironmentLoader();
  const Env = await EnvironmentLoader.load();

  const System = await createSystemAdapters(Env);
  const Tools = createTools(Env, System);
  const deps = { ...System, ...Tools };

  const AI = createAuthAdapter(Env, deps);
  const Auth = createAuthAdapters();
  const Emotions = createEmotionsAdapters(Env, deps);
  const History = createHistoryAdapters(deps);
  const Preferences = createPreferencesAdapters();
  const Publishing = createPublishingAdapters(deps);

  return {
    Env,
    Adapters: { AI, Auth, Emotions, History, Preferences, Publishing, System },
    Tools,
  };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
