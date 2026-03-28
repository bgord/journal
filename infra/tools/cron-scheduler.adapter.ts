import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export async function createCronScheduler(Env: EnvironmentResultType): Promise<bg.CronSchedulerPort> {
  const CronScheduler = await bg.CronSchedulerCronerAdapter.build();

  return {
    [bg.NodeEnvironmentEnum.local]: CronScheduler,
    [bg.NodeEnvironmentEnum.test]: new bg.CronSchedulerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: CronScheduler,
    [bg.NodeEnvironmentEnum.production]: CronScheduler,
  }[Env.type];
}
