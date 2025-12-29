import type * as bg from "@bgord/bun";
import type { EventStoreType } from "+infra/adapters/system/event-store";
import type { EnvironmentType } from "+infra/env";
import { createCacheResponse } from "./cache-response";
import { I18nConfig } from "./i18n";
import { createJobs } from "./jobs";
import { createPrerequisites } from "./prerequisites";
import { createShieldAuth } from "./shield-auth.strategy";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
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
  EventStore: EventStoreType;
  JobHandler: bg.JobHandlerStrategy;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export function createTools(Env: EnvironmentType, deps: Dependencies) {
  const Jobs = createJobs(deps);

  return {
    ShieldTimeout,
    ShieldRateLimit: createShieldRateLimit(Env, deps),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    Auth: createShieldAuth(Env, deps),
    Prerequisites: createPrerequisites(Env, { ...deps, Jobs }),
    I18nConfig,
    CacheResponse: createCacheResponse(),
    Jobs,
  };
}
