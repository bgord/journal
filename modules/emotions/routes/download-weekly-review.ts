import hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { PdfGenerator } from "+infra/adapters/emotions";

export const DownloadWeeklyReview = (WeeklyReviewExport: Emotions.Queries.WeeklyReviewExport) =>
  async function DownloadWeeklyReview(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
    const user = c.get("user");
    const weeklyReviewId = Emotions.VO.WeeklyReviewId.parse(c.req.param("weeklyReviewId"));

    const weeklyReview = await WeeklyReviewExport.getFull(weeklyReviewId);

    Emotions.Invariants.WeeklyReviewExists.perform({ weeklyReview });
    Emotions.Invariants.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
    Emotions.Invariants.RequesterOwnsWeeklyReview.perform({
      requesterId: user.id,
      ownerId: weeklyReview?.userId,
    });

    const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(
      PdfGenerator,
      weeklyReview as Emotions.Queries.WeeklyReviewExportDto,
    );

    return pdf.toResponse();
  };
