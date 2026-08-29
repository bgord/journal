import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";
import { createBuildInfoConfig } from "./build-info-config.adapter";
import { createCommandBus } from "./command-bus";
import { createCronScheduler } from "./cron-scheduler.adapter";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { HashContent } from "./hash-content.strategy";
import { createPrerequisites } from "./prerequisites";
import { createShieldAuth } from "./shield-auth.strategy";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldCaptcha } from "./shield-captcha.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { createShieldSecurity } from "./shield-security.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";
import { createSseRegistry } from "./sse-registry.adapter";
import { createTranslationsProvider } from "./translations-provider.adapter";

type Dependencies = {
  Clock: bg.ClockPort;
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  Mailer: bg.MailerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  TemporaryFile: bg.TemporaryFilePort;
  FileReaderJson: bg.FileReaderJsonPort;
  IdProvider: bg.IdProviderPort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
  FileInspection: bg.FileInspectionPort;
};

export async function createTools(Env: EnvironmentResultType, deps: Dependencies) {
  const EventBus = createEventBus(deps);
  const EventStore = createEventStore(Env, { ...deps, EventBus });
  const CronScheduler = await createCronScheduler(Env, deps);
  const TranslationsProvider = createTranslationsProvider(deps);
  const BuildInfoConfig = createBuildInfoConfig(Env, deps);
  const CommitConfig = new bg.StaticConfigAdapter<bg.CommitShaValueType>((await BuildInfoConfig.get()).sha);

  return {
    Auth: createShieldAuth(Env, { ...deps, EventStore, CommitConfig }),
    CronScheduler,
    Prerequisites: createPrerequisites(Env, { ...deps, TranslationsProvider, CronScheduler }),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    ShieldCaptcha: createShieldCaptcha(Env),
    ShieldRateLimit: createShieldRateLimit(Env, { ...deps, HashContent }),
    ShieldTimeout,
    EventHandler: createEventHandler(deps),
    CommandBus: createCommandBus(deps),
    EventBus,
    EventStore,
    ShieldSecurity: createShieldSecurity(Env, { ...deps, HashContent }),
    BuildInfoConfig,
    CommitConfig,
    SseRegistry: createSseRegistry(deps),
    HashContent,
    TranslationsProvider,
  };
}
