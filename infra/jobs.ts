import * as bg from "@bgord/bun";
import { Cron } from "croner";
import * as Emotions from "../modules/emotions";
import { logger } from "./logger";

const JobHandler = new bg.JobHandler(logger);

const WeeklyReviewSchedulerJob = new Cron(
  Emotions.Services.WeeklyReviewScheduler.cron,
  { protect: JobHandler.protect },
  JobHandler.handle(Emotions.Services.WeeklyReviewScheduler),
);

export const jobs = { WeeklyReviewSchedulerJob };
