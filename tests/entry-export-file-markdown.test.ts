import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("EntryExportFileMarkdown", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileMarkdown([mocks.fullEntry]);
    const result = file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.entryMarkdown);
  });
});
