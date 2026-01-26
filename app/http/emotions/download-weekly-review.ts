import type * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  WeeklyReviewExportQuery: Emotions.Queries.WeeklyReviewExport;
  PdfGenerator: bg.PdfGeneratorPort;
};

export const DownloadWeeklyReview = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const weeklyReview = await deps.WeeklyReviewExportQuery.getFull(weeklyReviewId);

  Emotions.Invariants.WeeklyReviewExists.enforce({ weeklyReview });
  Emotions.Invariants.WeeklyReviewIsCompleted.enforce({ status: weeklyReview?.status });
  Emotions.Invariants.RequesterOwnsWeeklyReview.enforce({ requesterId, ownerId: weeklyReview?.userId });

  if (!weeklyReview) return c.status(404);
  return new Emotions.Services.WeeklyReviewExportPdfFile(weeklyReview, deps).toResponse();
};
