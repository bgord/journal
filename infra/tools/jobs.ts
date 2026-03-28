import * as bg from "@bgord/bun";
import { Cron } from "croner";

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<bg.System.Events.HourHasPassedEventType>;
  CronTaskHandler: bg.CronTaskHandlerStrategy;
};

export function createJobs(deps: Dependencies) {
  const PassageOfTimeJob = new Cron(
    bg.System.Services.PassageOfTimeHourly.cron,
    {},
    deps.JobHandler.handle(new bg.System.Services.PassageOfTimeHourly(deps)),
  );

  return { PassageOfTimeJob };
}
