import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  WeeklyReviewExportQuery: Emotions.Queries.WeeklyReviewExport;
  PdfGenerator: bg.PdfGeneratorPort;
};

export const DownloadWeeklyReview = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const requesterId = context.identity.authenticatedUserId();
  const weeklyReviewId = v.parse(Emotions.VO.WeeklyReviewId, params["weeklyReviewId"]);

  const weeklyReview = await deps.WeeklyReviewExportQuery.getFull(weeklyReviewId);

  Emotions.Invariants.WeeklyReviewExists.enforce({ weeklyReview });
  // biome-ignore lint: lint/style/noNonNullAssertion
  Emotions.Invariants.WeeklyReviewIsCompleted.enforce({ status: weeklyReview!.status });
  // biome-ignore lint: lint/style/noNonNullAssertion
  Emotions.Invariants.RequesterOwnsWeeklyReview.enforce({ requesterId, ownerId: weeklyReview!.userId });

  // biome-ignore lint: lint/style/noNonNullAssertion
  return new Emotions.Services.WeeklyReviewExportPdfFile(weeklyReview!, deps).toResponse();
};
