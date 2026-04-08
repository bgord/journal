import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

const T0 = tools.Timestamp.fromNumber(1700000000000);

export function createClock(Env: EnvironmentResultType): bg.ClockPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ClockSystemAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.ClockFixedAdapter(T0),
    [bg.NodeEnvironmentEnum.staging]: new bg.ClockSystemAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.ClockSystemAdapter(),
  }[Env.type];
}
