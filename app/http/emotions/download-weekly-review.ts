import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  WeeklyReviewExportQuery: Emotions.Queries.WeeklyReviewExport;
  PdfGenerator: bg.PdfGeneratorPort;
};

export const DownloadWeeklyReview =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
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
