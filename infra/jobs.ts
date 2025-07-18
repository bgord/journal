import * as Emotions from "+emotions";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import { Cron } from "croner";

const JobHandler = new bg.JobHandler(logger);

const WeeklyReviewSchedulerJob = new Cron(
  Emotions.Services.WeeklyReviewScheduler.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(Emotions.Services.WeeklyReviewScheduler),
);

const InactivityAlarmSchedulerJob = new Cron(
  Emotions.Services.InactivityAlarmScheduler.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(Emotions.Services.InactivityAlarmScheduler),
);

export const jobs = { WeeklyReviewSchedulerJob, InactivityAlarmSchedulerJob };
