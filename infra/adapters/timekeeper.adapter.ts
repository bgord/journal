import * as bg from "@bgord/bun";
import { Env } from "+infra/env";
import { Clock } from "./clock.adapter";

export const Timekeeper: bg.TimekeeperPort = {
  [bg.NodeEnvironmentEnum.local]: new bg.TimekeeperGoogleAdapter(),
  [bg.NodeEnvironmentEnum.test]: new bg.TimekeeperNoopAdapter(Clock),
  [bg.NodeEnvironmentEnum.staging]: new bg.TimekeeperGoogleAdapter(),
  [bg.NodeEnvironmentEnum.production]: new bg.TimekeeperGoogleAdapter(),
}[Env.type];
