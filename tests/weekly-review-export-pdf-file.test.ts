import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", async () => {
  const di = await bootstrap(mocks.Env);

  test("generates a PDF", async () => {
    const file = new Emotions.Services.WeeklyReviewExportPdfFile(
      di.Adapters.Emotions.PdfGenerator,
      mocks.weeklyReviewFull,
    );
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
