// cspell:ignore shellcheck
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { languages } from "+languages";
import { hostname } from "+infra/config";
import { sqlite } from "+infra/db";
import { BackupLastSuccessPath, type EnvironmentResultType, MasterKeyPath, SecretsPath } from "+infra/env";

type Dependencies = {
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  Mailer: bg.MailerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  CronScheduler: bg.CronSchedulerPort;
  TemporaryFile: bg.TemporaryFilePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  TranslationsProvider: bg.TranslationsProviderPort;
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
  FileInspection: bg.FileInspectionPort;
  JobQueueStatsProvider: bg.JobQueueStatsProviderPort;
  HashContent: bg.HashContentStrategy;
};

export function createPrerequisites(
  Env: EnvironmentResultType,
  deps: Dependencies,
): {
  healthcheck: Array<bg.Prerequisite>;
  readiness: Array<bg.Prerequisite>;
  runtime: Array<bg.Prerequisite>;
} {
  const production = Env.type === bg.NodeEnvironmentEnum.production;
  const local = Env.type === bg.NodeEnvironmentEnum.local;

  const withTimeout = bg.PrerequisiteDecorator.withTimeout(tools.Duration.Seconds(5), deps);
  const withFailSafe = bg.PrerequisiteDecorator.withFailSafe(
    (result) => result.outcome === bg.PrerequisiteVerificationOutcome.failure,
  );
  const withRetry = bg.PrerequisiteDecorator.withRetry(
    {
      max: tools.Int.positive(2),
      backoff: new bg.RetryBackoffLinearStrategy(tools.Duration.Ms(300)),
    },
    deps,
  );
  const LongCacheResolver = new bg.CacheResolverReadThroughStrategy({
    CacheRepository: new bg.CacheRepositoryInMemoryAdapter(
      { type: "finite", ttl: tools.Duration.Minutes(10) },
      deps,
    ),
  });
  const ShortCacheResolver = new bg.CacheResolverReadThroughStrategy({
    CacheRepository: new bg.CacheRepositoryInMemoryAdapter(
      { type: "finite", ttl: tools.Duration.Minutes(5) },
      deps,
    ),
  });

  return {
    healthcheck: [
      new bg.Prerequisite("port", new bg.PrerequisiteVerifierPortAdapter({ port: Env.PORT })),
      new bg.Prerequisite(
        "timezone",
        new bg.PrerequisiteVerifierTimezoneUtcAdapter({ timezone: v.parse(tools.Timezone, Env.TZ) }),
      ),
      new bg.Prerequisite("ram", new bg.PrerequisiteVerifierRamAdapter({ minimum: tools.Size.fromMB(128) }), {
        enabled: production,
        decorators: [withRetry],
      }),
      new bg.Prerequisite(
        "disk-space",
        new bg.PrerequisiteVerifierSpaceAdapter({ minimum: tools.Size.fromMB(512) }, deps),
        { decorators: [withRetry] },
      ),
      new bg.Prerequisite(
        "bun",
        new bg.PrerequisiteVerifierBunAdapter({
          version: tools.PackageVersion.fromVersionString("1.4.4"),
          current: Bun.version,
        }),
      ),
      new bg.Prerequisite(
        "memory-consumption",
        new bg.PrerequisiteVerifierMemoryAdapter({ maximum: tools.Size.fromMB(300) }),
        { decorators: [withRetry] },
      ),
      new bg.Prerequisite(
        "temporary-files dir",
        new bg.PrerequisiteVerifierDirectoryAdapter({ directory: deps.TemporaryFile.root }, deps),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "remote-file-storage dir",
        new bg.PrerequisiteVerifierDirectoryAdapter({ directory: deps.RemoteFileStorage.root }, deps),
        { enabled: production },
      ),
      new bg.Prerequisite("cron-scheduler", new bg.PrerequisiteVerifierCronSchedulerAdapter(deps)),
      new bg.Prerequisite("translations", new bg.PrerequisiteVerifierTranslationsAdapter(languages, deps)),
      new bg.Prerequisite("mailer", new bg.PrerequisiteVerifierMailerAdapter(deps), {
        enabled: production,
        decorators: [
          bg.PrerequisiteDecorator.withCache("mailer", { CacheResolver: LongCacheResolver, ...deps }),
          withRetry,
          withTimeout,
        ],
      }),
      new bg.Prerequisite("outside-connectivity", new bg.PrerequisiteVerifierOutsideConnectivityAdapter(), {
        enabled: production,
        decorators: [
          bg.PrerequisiteDecorator.withCache("outside-connectivity", {
            CacheResolver: ShortCacheResolver,
            ...deps,
          }),
          withFailSafe,
          withRetry,
          withTimeout,
        ],
      }),
      new bg.Prerequisite("user", new bg.PrerequisiteVerifierRunningUserAdapter({ username: "journal" }), {
        enabled: production,
      }),
      new bg.Prerequisite("sqlite", new bg.PrerequisiteVerifierSQLiteAdapter({ sqlite }), {
        enabled: production,
      }),
      new bg.Prerequisite("dns", new bg.PrerequisiteVerifierDnsAdapter({ hostname }), {
        enabled: production,
        decorators: [
          bg.PrerequisiteDecorator.withCache("dns", { CacheResolver: ShortCacheResolver, ...deps }),
        ],
      }),
      new bg.Prerequisite(
        "clock-drift",
        new bg.PrerequisiteVerifierClockDriftAdapter({ skew: tools.Duration.Minutes(1) }, deps),
        { enabled: production, decorators: [withRetry, withTimeout] },
      ),
      new bg.Prerequisite("os", new bg.PrerequisiteVerifierOsAdapter({ accepted: ["Darwin", "Linux"] })),
      new bg.Prerequisite(
        "httpie",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "http") }),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "sqlite3",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "sqlite3") }),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "tar",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "tar") }),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "gitleaks",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "gitleaks") }),
        { enabled: local },
      ),
      new bg.Prerequisite(
        "shellcheck",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "shellcheck") }),
        { enabled: local },
      ),
      new bg.Prerequisite(
        "zizmor",
        new bg.PrerequisiteVerifierBinaryAdapter({ binary: v.parse(bg.Binary, "zizmor") }),
        { enabled: local },
      ),
      new bg.Prerequisite(
        "master-key",
        new bg.PrerequisiteVerifierFileAdapter({ file: MasterKeyPath, permissions: { read: true } }, deps),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "secrets",
        new bg.PrerequisiteVerifierFileAdapter({ file: SecretsPath, permissions: { read: true } }, deps),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "build-info-file",
        new bg.PrerequisiteVerifierFileAdapter(
          { file: bg.BUILD_INFO_FILE_PATH, permissions: { read: true } },
          deps,
        ),
        { enabled: production },
      ),
    ],
    readiness: [
      new bg.Prerequisite(
        "disk-space",
        new bg.PrerequisiteVerifierSpaceAdapter({ minimum: tools.Size.fromMB(512) }, deps),
      ),
      new bg.Prerequisite(
        "memory-consumption",
        new bg.PrerequisiteVerifierMemoryAdapter({ maximum: tools.Size.fromMB(300) }),
      ),
      new bg.Prerequisite("ram", new bg.PrerequisiteVerifierRamAdapter({ minimum: tools.Size.fromMB(128) }), {
        enabled: production,
      }),
      new bg.Prerequisite("sqlite", new bg.PrerequisiteVerifierSQLiteConnectionAdapter({ sqlite })),
    ],
    runtime: [
      new bg.Prerequisite(
        "job-queue-lag",
        new bg.PrerequisiteVerifierJobQueueLagAdapter({ maximum: tools.Duration.Minutes(15) }, deps),
      ),
      new bg.Prerequisite(
        "backup",
        new bg.PrerequisiteVerifierBackupAdapter(
          { file: BackupLastSuccessPath, maximum: tools.Duration.Hours(26) },
          deps,
        ),
        { enabled: production },
      ),
      new bg.Prerequisite(
        "ssl",
        new bg.PrerequisiteVerifierSSLCertificateExpiryAdapter(
          { hostname, minimum: tools.Duration.Days(7) },
          deps,
        ),
        {
          enabled: production,
          decorators: [
            bg.PrerequisiteDecorator.withCache("ssl", { CacheResolver: LongCacheResolver, ...deps }),
            withRetry,
            withTimeout,
          ],
        },
      ),
    ],
  };
}
