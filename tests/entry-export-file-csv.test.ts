import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { Clock: Adapters.Clock, Stringifier: Adapters.CsvStringifier };

describe("EntryExportFileCsv", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileCsv([mocks.fullEntry], deps);
    const result = await text(file.create());

    expect(result).toEqualIgnoringWhitespace(mocks.entryCsv);
  });
});
