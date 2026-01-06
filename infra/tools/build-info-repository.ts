import * as bg from "@bgord/bun";

type Dependencies = { Clock: bg.ClockPort; FileReaderJson: bg.FileReaderJsonPort };

export function createBuildInfoRepository(deps: Dependencies): bg.BuildInfoRepository {
  return new bg.BuildInfoRepository(deps);
}
