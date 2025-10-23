import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

export async function DownloadWeeklyReview(c: hono.Context<infra.HonoConfig>) {
  const requesterId = c.get("user").id;
  const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

  const weeklyReview = await Adapters.Emotions.WeeklyReviewExport.getFull(weeklyReviewId);

  Emotions.Invariants.WeeklyReviewExists.perform({ weeklyReview });
  Emotions.Invariants.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
  Emotions.Invariants.RequesterOwnsWeeklyReview.perform({ requesterId, ownerId: weeklyReview?.userId });

  const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(
    Adapters.Emotions.PdfGenerator,
    weeklyReview as Emotions.Queries.WeeklyReviewExportDto,
  );

  return pdf.toResponse();
}
