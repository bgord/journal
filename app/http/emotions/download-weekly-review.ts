import type * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  WeeklyReviewExport: Emotions.Queries.WeeklyReviewExport;
  PdfGenerator: bg.PdfGeneratorPort;
};

export const DownloadWeeklyReview = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const weeklyReview = await deps.WeeklyReviewExport.getFull(weeklyReviewId);

  Emotions.Invariants.WeeklyReviewExists.perform({ weeklyReview });
  Emotions.Invariants.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
  Emotions.Invariants.RequesterOwnsWeeklyReview.perform({ requesterId, ownerId: weeklyReview?.userId });

  const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(
    deps.PdfGenerator,
    weeklyReview as Emotions.Queries.WeeklyReviewExportDto,
  );

  return pdf.toResponse();
};
