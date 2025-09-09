import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";
import { LoggerWinstonProductionAdapter } from "+infra/adapters/logger.adapter";
import { Env } from "+infra/env";
import { jobs } from "+infra/jobs";
import { TemporaryFileDirectory } from "+infra/temporary-file.adapter";

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteTimezoneUTC({ label: "timezone", timezone: tools.Timezone.parse(Env.TZ) }),
  new bg.PrerequisiteRAM({
    label: "RAM",
    minimum: tools.Size.fromMB(128),
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
  new bg.PrerequisiteSpace({ label: "disk-space", minimum: tools.Size.fromMB(512) }),
  new bg.PrerequisiteNode({
    label: "node",
    version: tools.PackageVersion.fromStringWithV("v24.3.0"),
    current: process.version,
  }),
  new bg.PrerequisiteBun({
    label: "bun",
    version: tools.PackageVersion.fromString("1.2.19"),
    current: Bun.version,
  }),
  new bg.PrerequisiteMemory({ label: "memory-consumption", maximum: tools.Size.fromMB(300) }),
  new bg.PrerequisiteLogFile({
    label: "log-file",
    logger: LoggerWinstonProductionAdapter,
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
  new bg.PrerequisiteDirectory({ label: "temporary-files dir", directory: TemporaryFileDirectory }),
  new bg.PrerequisiteJobs({
    label: "jobs",
    jobs,
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
  new bg.PrerequisiteTranslations({ label: "translations", supportedLanguages: SupportedLanguages }),
];
