import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { Clock: Adapters.Clock, PdfGenerator: Adapters.Emotions.PdfGenerator };

describe("EntryExportFilePdf", () => {
  test("generates a PDF", async () => {
    const file = new Emotions.Services.EntryExportFilePdf([mocks.fullEntry], deps);
    const result = await file.create();

    expect(result).toEqual(mocks.PDF);
  });
});
