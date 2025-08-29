import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("EntryExportFilePdf", () => {
  test("generates a PDF", async () => {
    const file = new Emotions.Services.EntryExportFilePdf(Adapters.Emotions.PdfGenerator, [mocks.fullEntry]);
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
