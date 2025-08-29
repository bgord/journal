import * as bg from "@bgord/bun";
import { Cron } from "croner";
import * as App from "+app";
import { IdProvider } from "+infra/adapters";
import { logger } from "+infra/adapters/logger.adapter";

const JobHandler = new bg.JobHandler(logger, IdProvider);

const PassageOfTimeJob = new Cron(
  App.Services.PassageOfTime.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(App.Services.PassageOfTime),
);

export const jobs = { PassageOfTimeJob };
