import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", () => {
  test("generates a PDF", async () => {
    const file = new Emotions.Services.WeeklyReviewExportPdfFile(
      Adapters.Emotions.PdfGenerator,
      mocks.weeklyReviewFull,
    );
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
