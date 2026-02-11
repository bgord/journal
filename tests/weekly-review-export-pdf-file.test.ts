import { describe, expect, spyOn, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", async () => {
  const di = await bootstrap();
  const file = new Emotions.Services.WeeklyReviewExportPdfFile(mocks.weeklyReviewFull, {
    ...di.Adapters.Emotions,
  });

  test("generates a PDF", async () => {
    using pdfGeneratorRequest = spyOn(di.Adapters.Emotions.PdfGenerator, "request");

    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
    expect(pdfGeneratorRequest).toHaveBeenCalledWith("weekly_review_export", mocks.weeklyReviewFull);
  });
});
