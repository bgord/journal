import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { PdfGenerator } from "+infra/pdf-generator";
import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function DownloadWeeklyReview(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const weeklyReview = await Emotions.Repos.WeeklyReviewRepository.getById(weeklyReviewId);

  Emotions.Policies.WeeklyReviewExists.perform({ weeklyReview });
  Emotions.Policies.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
  Emotions.Policies.RequesterOwnsWeeklyReview.perform({
    requesterId: user.id,
    ownerId: weeklyReview?.userId,
  });

  const week = tools.Week.fromIsoId(weeklyReview?.weekIsoId as string);
  const entries = await Emotions.Repos.EntryRepository.findInWeekForUser(week, user.id);
  const patterns = await Emotions.Repos.PatternsRepository.findInWeekForUser(week, user.id);
  const alarms = await Emotions.Repos.AlarmRepository.findInWeekForUser(week, user.id);

  const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(PdfGenerator, {
    weeklyReview: weeklyReview as Schema.SelectWeeklyReviews,
    entries: entries as Schema.SelectEntries[],
    patterns: patterns as Schema.SelectPatternDetections[],
    alarms: alarms as Schema.SelectAlarms[],
  });

  return pdf.toResponse();
}
