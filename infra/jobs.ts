import type * as bg from "@bgord/bun";
import { Cron } from "croner";
import * as App from "+app";
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
    App.Services.PassageOfTime.cron,
    {},
    deps.JobHandler.handle(new App.Services.PassageOfTime(deps)),
  );

  return { PassageOfTimeJob };
}
