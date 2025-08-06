import * as App from "+app";
import * as Emotions from "+emotions";
import { logger } from "+infra/logger";
import * as Publishing from "+publishing";
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

const ShareableLinksExpirerJob = new Cron(
  Publishing.Services.ShareableLinksExpirer.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(Publishing.Services.ShareableLinksExpirer),
);

const PassageOfTimeJob = new Cron(
  App.Services.PassageOfTime.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(App.Services.PassageOfTime),
);

export const jobs = {
  WeeklyReviewSchedulerJob,
  InactivityAlarmSchedulerJob,
  ShareableLinksExpirerJob,
  PassageOfTimeJob,
};
