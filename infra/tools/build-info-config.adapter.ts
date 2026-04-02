import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort; FileReaderJson: bg.FileReaderJsonPort };

export function createBuildInfoConfig(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.ReactiveConfigPort<bg.BuildInfoType> {
  const noop = new bg.ReactiveConfigNoopAdapter<bg.BuildInfoType>(bg.BuildInfo, {
    timestamp: tools.Timestamp.fromNumber(1767775662000).ms,
    version: v.parse(tools.PackageVersionSchema, "v1.0.0"),
    sha: bg.CommitSha.fromString("a".repeat(40)).value,
    size: tools.Size.fromBytes(0).toBytes(),
  });

  return {
    [bg.NodeEnvironmentEnum.local]: noop,
    [bg.NodeEnvironmentEnum.test]: noop,
    [bg.NodeEnvironmentEnum.staging]: noop,
    [bg.NodeEnvironmentEnum.production]: new bg.ReactiveConfigFileJsonAdapter<bg.BuildInfoType>(
      bg.BUILD_INFO_FILE_PATH,
      bg.BuildInfo,
      deps,
    ),
  }[Env.type];
}
