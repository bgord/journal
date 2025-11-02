import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const T0 = tools.Timestamp.fromNumber(Date.UTC(2025, 0, 1, 0, 0, 0));

export const Clock: bg.ClockPort = {
  [bg.NodeEnvironmentEnum.local]: new bg.ClockSystemAdapter(),
  [bg.NodeEnvironmentEnum.test]: new bg.ClockFixedAdapter(T0),
  [bg.NodeEnvironmentEnum.staging]: new bg.ClockSystemAdapter(),
  [bg.NodeEnvironmentEnum.production]: new bg.ClockSystemAdapter(),
}[Env.type];
