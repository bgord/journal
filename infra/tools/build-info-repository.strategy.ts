import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort; FileReaderJson: bg.FileReaderJsonPort };

export function createBuildInfoRepository(
  Env: EnvironmentType,
  deps: Dependencies,
): bg.BuildInfoRepositoryPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.BuildInfoRepositoryPackageJsonStrategy(deps),
    [bg.NodeEnvironmentEnum.test]: new bg.BuildInfoRepositoryNoopStrategy(
      tools.Timestamp.fromNumber(1767775662000),
      tools.PackageVersion.fromString("1.0.0"),
    ),
    [bg.NodeEnvironmentEnum.staging]: new bg.BuildInfoRepositoryPackageJsonStrategy(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.BuildInfoRepositoryPackageJsonStrategy(deps),
  }[Env.type];
}
