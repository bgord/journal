import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EntryExportFile", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFile([mocks.fullEntry]);
    const result = await text(file.generate());

    expect(result).toEqualIgnoringWhitespace(mocks.csv);
  });
});
