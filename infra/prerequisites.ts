import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import { Env } from "./env";
import { logger } from "./logger";

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteTimezoneUTC({
    label: "timezone",
    timezone: tools.Timezone.parse(Env.TZ),
  }),
  new bg.PrerequisiteRAM({
    label: "RAM",
    enabled: Env.type !== bg.NodeEnvironmentEnum.local,
    minimum: new tools.Size({ unit: tools.SizeUnit.MB, value: 128 }),
  }),
  new bg.PrerequisiteSpace({
    label: "disk-space",
    minimum: new tools.Size({ unit: tools.SizeUnit.MB, value: 512 }),
  }),
  new bg.PrerequisiteNode({
    label: "node",
    version: tools.PackageVersion.fromStringWithV("v24.1.0"),
  }),
  new bg.PrerequisiteBun({
    label: "bun",
    version: tools.PackageVersion.fromString("1.2.15"),
    current: Bun.version,
  }),
  new bg.PrerequisiteMemory({
    label: "memory-consumption",
    maximum: new tools.Size({ value: 300, unit: tools.SizeUnit.MB }),
  }),
  new bg.PrerequisiteLogFile({
    label: "log-file",
    logger,
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
];
