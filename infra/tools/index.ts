import type * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";
import { createBuildInfoConfig } from "./build-info-config.adapter";
import { createCacheResponse } from "./cache-response";
import { createCommandBus } from "./command-bus";
import { createCronScheduler } from "./cron-scheduler.adapter";
import { createCronTaskHandler } from "./cron-task-handler.strategy";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { HashContent } from "./hash-content.strategy";
import { createJobs } from "./jobs";
import { createPrerequisites } from "./prerequisites";
import { createShieldAuth } from "./shield-auth.strategy";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldCaptcha } from "./shield-captcha.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { createShieldSecurity } from "./shield-security.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";
import { createSseRegistry } from "./sse-registry.adapter";

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

export function createTools(Env: EnvironmentResultType, deps: Dependencies) {
  const EventBus = createEventBus(deps);
  const EventStore = createEventStore(Env, { ...deps, EventBus });
  const CronTaskHandler = createCronTaskHandler(Env, deps);
  const CronScheduler = createCronScheduler(Env);
  const Jobs = createJobs({ ...deps, EventStore, CronTaskHandler });

  return {
    Auth: createShieldAuth(Env, { ...deps, EventStore }),
    CacheResponse: createCacheResponse({ HashContent }),
    Jobs,
    Prerequisites: createPrerequisites(Env, { ...deps, Jobs }),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    ShieldCaptcha: createShieldCaptcha(Env),
    ShieldRateLimit: createShieldRateLimit(Env, { ...deps, HashContent }),
    ShieldTimeout,
    EventHandler: createEventHandler(deps),
    CommandBus: createCommandBus(deps),
    EventBus,
    EventStore,
    ShieldSecurity: createShieldSecurity(Env, { ...deps, HashContent }),
    BuildInfoConfig: createBuildInfoConfig(Env, deps),
    SseRegistry: createSseRegistry(deps),
    HashContent,
  };
}
