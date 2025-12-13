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
  const enabled = Env.type === bg.NodeEnvironmentEnum.production;

  return [
    new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
    new bg.PrerequisiteTimezoneUTC({ label: "timezone", timezone: tools.Timezone.parse(Env.TZ) }),
    new bg.PrerequisiteRAM({ label: "RAM", minimum: tools.Size.fromMB(128), enabled }),
    new bg.PrerequisiteSpace({
      label: "disk-space",
      minimum: tools.Size.fromMB(512),
      DiskSpaceChecker: deps.DiskSpaceChecker,
    }),
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
    new bg.PrerequisiteLogFile({ label: "log-file", Logger: deps.Logger, enabled }),
    new bg.PrerequisiteDirectory({
      label: "temporary-files dir",
      directory: deps.TemporaryFile.root,
      enabled,
    }),
    new bg.PrerequisiteDirectory({
      label: "remote-file-storage dir",
      directory: deps.RemoteFileStorage.root,
      enabled,
    }),
    new bg.PrerequisiteJobs({ label: "jobs", Jobs: deps.Jobs }),
    new bg.PrerequisiteTranslations({
      label: "translations",
      supportedLanguages: SupportedLanguages,
      Logger: deps.Logger,
    }),
    new bg.PrerequisiteMailer({ label: "mailer", Mailer: deps.Mailer, enabled }),
    new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity", enabled }),
    new bg.PrerequisiteRunningUser({ label: "user", username: "bgord", enabled }),
    new bg.PrerequisiteSQLite({ label: "sqlite", sqlite, enabled }),
    new bg.PrerequisiteSSLCertificateExpiry({
      label: "ssl",
      hostname: "journal.bgord.dev",
      days: 7,
      enabled,
      CertificateInspector: deps.CertificateInspector,
    }),
    new bg.PrerequisiteClockDrift({
      label: "clock-drift",
      enabled,
      skew: tools.Duration.Minutes(1),
      Timekeeper: deps.Timekeeper,
    }),
    new bg.PrerequisiteOs({ label: "os", accepted: ["Darwin", "Linux"] }),
    new bg.PrerequisiteBinary({ label: "httpie", binary: bg.Binary.parse("http"), enabled }),
    new bg.PrerequisiteBinary({ label: "sqlite3", binary: bg.Binary.parse("sqlite3"), enabled }),
    new bg.PrerequisiteBinary({ label: "tar", binary: bg.Binary.parse("tar"), enabled }),
  ];
}
