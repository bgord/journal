import * as App from "+app";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import { Cron } from "croner";

const JobHandler = new bg.JobHandler(logger);

const PassageOfTimeJob = new Cron(
  App.Services.PassageOfTime.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(App.Services.PassageOfTime),
);

export const jobs = { PassageOfTimeJob };
