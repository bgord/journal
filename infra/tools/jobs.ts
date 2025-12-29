import * as bg from "@bgord/bun";
import { Cron } from "croner";
import type { EventStoreType } from "+infra/adapters/system/event-store";

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: EventStoreType;
  JobHandler: bg.JobHandlerPort;
};

export function createJobs(deps: Dependencies) {
  const PassageOfTimeJob = new Cron(
    bg.System.Services.PassageOfTimeHourly.cron,
    {},
    deps.JobHandler.handle(new bg.System.Services.PassageOfTimeHourly(deps)),
  );

  return { PassageOfTimeJob };
}
