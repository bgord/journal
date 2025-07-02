import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { logger } from "+infra";
import { Cron } from "croner";

const JobHandler = new bg.JobHandler(logger);

const WeeklyReviewSchedulerJob = new Cron(
  Emotions.Services.WeeklyReviewScheduler.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(Emotions.Services.WeeklyReviewScheduler),
);

export const jobs = { WeeklyReviewSchedulerJob };
