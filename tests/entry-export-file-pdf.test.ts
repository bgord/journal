import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("EntryExportFilePdf", async () => {
  const di = await bootstrap();

  test("generates a PDF", async () => {
    const file = new Emotions.Services.EntryExportFilePdf([mocks.fullEntry], {
      ...di.Adapters.System,
      PdfGenerator: di.Adapters.Emotions.PdfGenerator,
    });

    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
