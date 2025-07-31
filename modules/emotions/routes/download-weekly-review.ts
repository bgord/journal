import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { PdfGenerator } from "+infra/pdf-generator";
import type * as Schema from "+infra/schema";
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

  const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(
    PdfGenerator,
    weeklyReview as Schema.SelectWeeklyReviews,
  );

  return pdf.toResponse();
}
