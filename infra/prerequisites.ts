import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";
import { LoggerWinstonProductionAdapter } from "+infra/adapters/logger.adapter";
import { Mailer } from "+infra/adapters/mailer.adapter";
import { RemoteFileStorageTmpRootDir } from "+infra/adapters/remote-file-storage.adapter";
import { sqlite } from "+infra/db";
import { Env } from "+infra/env";
import { jobs } from "+infra/jobs";
import { TemporaryFileDirectory } from "+infra/temporary-file.adapter";

const production = Env.type === bg.NodeEnvironmentEnum.production;

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteTimezoneUTC({ label: "timezone", timezone: tools.Timezone.parse(Env.TZ) }),
  new bg.PrerequisiteRAM({ label: "RAM", minimum: tools.Size.fromMB(128), enabled: production }),
  new bg.PrerequisiteSpace({ label: "disk-space", minimum: tools.Size.fromMB(512) }),
  new bg.PrerequisiteNode({
    label: "node",
    version: tools.PackageVersion.fromString("24.3.0"),
    current: process.version,
  }),
  new bg.PrerequisiteBun({
    label: "bun",
    version: tools.PackageVersion.fromString("1.2.22"),
    current: Bun.version,
  }),
  new bg.PrerequisiteMemory({ label: "memory-consumption", maximum: tools.Size.fromMB(300) }),
  new bg.PrerequisiteLogFile({
    label: "log-file",
    logger: LoggerWinstonProductionAdapter,
    enabled: production,
  }),
  new bg.PrerequisiteDirectory({ label: "temporary-files dir", directory: TemporaryFileDirectory }),
  new bg.PrerequisiteDirectory({ label: "remote-file-storage dir", directory: RemoteFileStorageTmpRootDir }),
  new bg.PrerequisiteJobs({ label: "jobs", jobs }),
  new bg.PrerequisiteTranslations({ label: "translations", supportedLanguages: SupportedLanguages }),
  new bg.PrerequisiteMailer({ label: "mailer", mailer: Mailer, enabled: production }),
  new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity", enabled: production }),
  new bg.PrerequisiteRunningUser({ label: "user", username: "bartosz", enabled: production }),
  new bg.PrerequisiteSQLite({ label: "sqlite", sqlite, enabled: production }),
  // new bg.PrerequisiteSSLCertificateExpiry({
  //   label: "certificate",
  //   host: "journal.bgord.dev",
  //   validDaysMinimum: 7,
  //   enabled: production,
  // }),
];
