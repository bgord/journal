import * as bg from "@bgord/bun";
import { Cron } from "croner";
import * as App from "+app";
import { Clock, IdProvider, Logger } from "+infra/adapters";

const JobHandler = new bg.JobHandler({ Logger, IdProvider, Clock });

const PassageOfTimeJob = new Cron(
  App.Services.PassageOfTime.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(App.Services.PassageOfTime),
);

export const jobs = { PassageOfTimeJob };
