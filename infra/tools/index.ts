import type * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";
import { createCacheResponse } from "./cache-response";
import { createCommandBus } from "./command-bus";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { I18nConfig } from "./i18n";
import { createJobHandler } from "./job-handler.adapter";
import { createJobs } from "./jobs";
import { createPrerequisites } from "./prerequisites";
import { createShieldAuth } from "./shield-auth.strategy";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldCaptcha } from "./shield-captcha.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";

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
};

export function createTools(Env: EnvironmentType, deps: Dependencies) {
  const EventBus = createEventBus(deps);
  const EventStore = createEventStore({ ...deps, EventBus });
  const JobHandler = createJobHandler(Env, deps);
  const Jobs = createJobs({ ...deps, EventStore, JobHandler });

  return {
    Auth: createShieldAuth(Env, { ...deps, EventStore }),
    CacheResponse: createCacheResponse(),
    I18nConfig,
    Jobs,
    Prerequisites: createPrerequisites(Env, { ...deps, Jobs }),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    ShieldCaptcha: createShieldCaptcha(Env),
    ShieldRateLimit: createShieldRateLimit(Env, deps),
    ShieldTimeout,
    EventHandler: createEventHandler(deps),
    CommandBus: createCommandBus(deps),
    EventBus,
    EventStore,
  };
}
