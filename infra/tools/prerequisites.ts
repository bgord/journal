import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";
import { sqlite } from "+infra/db";
import { type EnvironmentType, MasterKeyPath, SecretsPath } from "+infra/env";

type Dependencies = {
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  Mailer: bg.MailerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  Jobs: bg.MultipleJobsType;
  TemporaryFile: bg.TemporaryFilePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  FileReaderJson: bg.FileReaderJsonPort;
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
};

export function createPrerequisites(Env: EnvironmentType, deps: Dependencies) {
  const production = Env.type === bg.NodeEnvironmentEnum.production;
  const local = Env.type === bg.NodeEnvironmentEnum.local;

  const withTimeout = bg.PrerequisiteDecorator.withTimeout(tools.Duration.Seconds(2), deps);
  const withFailSafe = bg.PrerequisiteDecorator.withFailSafe(
    (result) => result.outcome === bg.PrerequisiteVerificationOutcome.failure,
  );
  const withRetry = bg.PrerequisiteDecorator.withRetry(
    { max: 2, backoff: new bg.RetryBackoffLinearStrategy(tools.Duration.Ms(300)) },
    deps,
  );

  return [
    new bg.Prerequisite("port", new bg.PrerequisiteVerifierPortAdapter({ port: Env.PORT })),
    new bg.Prerequisite(
      "timezone",
      new bg.PrerequisiteVerifierTimezoneUtcAdapter({ timezone: tools.Timezone.parse(Env.TZ) }),
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
      "node",
      new bg.PrerequisiteVerifierNodeAdapter({
        version: tools.PackageVersion.fromString("24.3.0"),
        current: process.version,
      }),
    ),
    new bg.Prerequisite(
      "bun",
      new bg.PrerequisiteVerifierBunAdapter({
        version: tools.PackageVersion.fromString("1.3.5"),
        current: Bun.version,
      }),
    ),
    new bg.Prerequisite(
      "memory-consumption",
      new bg.PrerequisiteVerifierMemoryAdapter({ maximum: tools.Size.fromMB(300) }),
      { decorators: [withRetry] },
    ),
    new bg.Prerequisite("log-file", new bg.PrerequisiteVerifierLogFileAdapter(deps), { enabled: production }),
    new bg.Prerequisite(
      "temporary-files dir",
      new bg.PrerequisiteVerifierDirectoryAdapter({ directory: deps.TemporaryFile.root }),
      { enabled: production },
    ),
    new bg.Prerequisite(
      "remote-file-storage dir",
      new bg.PrerequisiteVerifierDirectoryAdapter({ directory: deps.RemoteFileStorage.root }),
      { enabled: production },
    ),
    new bg.Prerequisite("jobs", new bg.PrerequisiteVerifierJobsAdapter(deps)),
    new bg.Prerequisite(
      "translations",
      new bg.PrerequisiteVerifierTranslationsAdapter({ supportedLanguages: SupportedLanguages }, deps),
    ),
    new bg.Prerequisite("mailer", new bg.PrerequisiteVerifierMailerAdapter(deps), {
      enabled: production,
      decorators: [withRetry, withTimeout],
    }),
    new bg.Prerequisite("outside-connectivity", new bg.PrerequisiteVerifierOutsideConnectivityAdapter(), {
      enabled: production,
      decorators: [withFailSafe, withRetry, withTimeout],
    }),
    new bg.Prerequisite("user", new bg.PrerequisiteVerifierRunningUserAdapter({ username: "bgord" }), {
      enabled: production,
    }),
    new bg.Prerequisite("sqlite", new bg.PrerequisiteVerifierSQLiteAdapter({ sqlite }), {
      enabled: production,
    }),
    new bg.Prerequisite(
      "ssl",
      new bg.PrerequisiteVerifierSSLCertificateExpiryAdapter(
        { hostname: "journal.bgord.dev", days: 7 },
        deps,
      ),
      { enabled: production, decorators: [withFailSafe, withRetry, withTimeout] },
    ),
    new bg.Prerequisite(
      "clock-drift",
      new bg.PrerequisiteVerifierClockDriftAdapter({ skew: tools.Duration.Minutes(1) }, deps),
      { enabled: production, decorators: [withRetry, withTimeout] },
    ),
    new bg.Prerequisite("os", new bg.PrerequisiteVerifierOsAdapter({ accepted: ["Darwin", "Linux"] })),
    new bg.Prerequisite(
      "httpie",
      new bg.PrerequisiteVerifierBinaryAdapter({ binary: bg.Binary.parse("http") }),
      { enabled: production },
    ),
    new bg.Prerequisite(
      "sqlite3",
      new bg.PrerequisiteVerifierBinaryAdapter({ binary: bg.Binary.parse("sqlite3") }),
      { enabled: production },
    ),
    new bg.Prerequisite("tar", new bg.PrerequisiteVerifierBinaryAdapter({ binary: bg.Binary.parse("tar") }), {
      enabled: production,
    }),
    new bg.Prerequisite(
      "gitleaks",
      new bg.PrerequisiteVerifierBinaryAdapter({ binary: bg.Binary.parse("gitleaks") }),
      { enabled: local },
    ),
    new bg.Prerequisite(
      "master-key",
      new bg.PrerequisiteVerifierFileAdapter({ file: MasterKeyPath, permissions: { read: true } }),
      { enabled: production },
    ),
    new bg.Prerequisite(
      "secrets",
      new bg.PrerequisiteVerifierFileAdapter({ file: SecretsPath, permissions: { read: true } }),
      { enabled: production },
    ),
  ];
}
