import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { PdfGenerator } from "+infra/pdf-generator";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", () => {
  test("generates a PDF", async () => {
    const file = new Emotions.Services.WeeklyReviewExportPdfFile(PdfGenerator, mocks.weeklyReviewFull);
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
