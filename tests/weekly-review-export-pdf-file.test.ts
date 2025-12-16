import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createEnvironmentLoader } from "+infra/env";
import * as mocks from "./mocks";

describe("WeeklyReviewExportPdfFile", async () => {
  const EnvironmentLoader = createEnvironmentLoader();
  const di = await bootstrap(await EnvironmentLoader.load());

  test("generates a PDF", async () => {
    const file = new Emotions.Services.WeeklyReviewExportPdfFile(
      di.Adapters.Emotions.PdfGenerator,
      mocks.weeklyReviewFull,
    );

    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
