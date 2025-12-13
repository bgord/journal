import * as bg from "@bgord/bun";
import { Cron } from "croner";
import * as App from "+app";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: ReturnType<typeof createEventStore>;
};

export function createJobs(deps: Dependencies) {
  const JobHandler = new bg.JobHandler(deps);

  const PassageOfTimeJob = new Cron(
    App.Services.PassageOfTime.cron,
    { protect: JobHandler.protect },
    JobHandler.handle(new App.Services.PassageOfTime(deps)),
  );

  return { PassageOfTimeJob };
}
