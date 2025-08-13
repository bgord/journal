import * as Emotions from "+emotions";
import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as mocks from "./mocks";

describe("EntryExportFile", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFile([mocks.fullEntry]);
    const result = await text(file.create());

    expect(result).toEqualIgnoringWhitespace(mocks.entryCsv);
  });
});
