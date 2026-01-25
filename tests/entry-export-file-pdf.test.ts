import { describe, expect, spyOn, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("EntryExportFilePdf", async () => {
  const di = await bootstrap();
  const file = new Emotions.Services.EntryExportFilePdf([mocks.fullEntry], {
    ...di.Adapters.System,
    PdfGenerator: di.Adapters.Emotions.PdfGenerator,
  });

  test("generates a PDF", async () => {
    const pdfGeneratorRequest = spyOn(di.Adapters.Emotions.PdfGenerator, "request");

    expect(await file.create()).toEqual(mocks.PDF);
    expect(pdfGeneratorRequest).toHaveBeenCalledWith("entry_export", { entries: [mocks.fullEntry] });
  });
});
