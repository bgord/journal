import * as bg from "@bgord/bun";
import type { BootstrapType } from "+infra/bootstrap";

export function registerCronTasks({ Tools, Adapters }: BootstrapType) {
  const CronTaskHandler = new bg.CronTaskHandlerWithLoggerStrategy(Adapters.System);

  const PassageOfTimeHourly = CronTaskHandler.handle(
    bg.System.CronTasks.PassageOfTimeHourlyCronTask({ ...Tools, ...Adapters.System }),
  );

  Tools.CronScheduler.schedule(PassageOfTimeHourly);
}
