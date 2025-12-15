import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";
import { sqlite } from "+infra/db";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  Mailer: bg.MailerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  Jobs: bg.MultipleJobsType;
  TemporaryFile: bg.TemporaryFilePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export function createPrerequisites(Env: EnvironmentType, deps: Dependencies) {
  const production = Env.type === bg.NodeEnvironmentEnum.production;
  const local = Env.type === bg.NodeEnvironmentEnum.local;

  return [
    new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
    new bg.PrerequisiteTimezoneUTC({ label: "timezone", timezone: tools.Timezone.parse(Env.TZ) }),
    new bg.PrerequisiteRAM({ label: "RAM", minimum: tools.Size.fromMB(128), enabled: production }),
    new bg.PrerequisiteSpace({ label: "disk-space", minimum: tools.Size.fromMB(512) }, deps),
    new bg.PrerequisiteNode({
      label: "node",
      version: tools.PackageVersion.fromString("24.3.0"),
      current: process.version,
    }),
    new bg.PrerequisiteBun({
      label: "bun",
      version: tools.PackageVersion.fromString("1.3.2"),
      current: Bun.version,
    }),
    new bg.PrerequisiteMemory({ label: "memory-consumption", maximum: tools.Size.fromMB(300) }),
    new bg.PrerequisiteLogFile({ label: "log-file", enabled: production }, deps),
    new bg.PrerequisiteDirectory({
      label: "temporary-files dir",
      directory: deps.TemporaryFile.root,
      enabled: production,
    }),
    new bg.PrerequisiteDirectory({
      label: "remote-file-storage dir",
      directory: deps.RemoteFileStorage.root,
      enabled: production,
    }),
    new bg.PrerequisiteJobs({ label: "jobs", Jobs: deps.Jobs }),
    new bg.PrerequisiteTranslations({ label: "translations", supportedLanguages: SupportedLanguages }, deps),
    new bg.PrerequisiteMailer({ label: "mailer", enabled: production }, deps),
    new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity", enabled: production }),
    new bg.PrerequisiteRunningUser({ label: "user", username: "bgord", enabled: production }),
    new bg.PrerequisiteSQLite({ label: "sqlite", sqlite, enabled: production }),
    new bg.PrerequisiteSSLCertificateExpiry(
      { label: "ssl", hostname: "journal.bgord.dev", days: 7, enabled: production },
      deps,
    ),
    new bg.PrerequisiteClockDrift(
      { label: "clock-drift", enabled: production, skew: tools.Duration.Minutes(1) },
      deps,
    ),
    new bg.PrerequisiteOs({ label: "os", accepted: ["Darwin", "Linux"] }),
    new bg.PrerequisiteBinary({ label: "httpie", binary: bg.Binary.parse("http"), enabled: production }),
    new bg.PrerequisiteBinary({ label: "sqlite3", binary: bg.Binary.parse("sqlite3"), enabled: production }),
    new bg.PrerequisiteBinary({ label: "tar", binary: bg.Binary.parse("tar"), enabled: production }),
    new bg.PrerequisiteBinary({ label: "gitleaks", binary: bg.Binary.parse("gitleaks"), enabled: local }),
  ];
}
