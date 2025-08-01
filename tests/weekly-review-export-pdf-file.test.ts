import { describe, expect, test } from "bun:test";
import { PdfGenerator } from "../infra/pdf-generator";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", () => {
  test("generates a PDF", async () => {
    const file = new Emotions.Services.WeeklyReviewExportPdfFile(PdfGenerator, mocks.weeklyReview);
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
