import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("AlarmExportFileCsv", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.AlarmExportFileCsv(Adapters.CsvStringifier, [mocks.alarm]);
    const result = await text(file.create());

    expect(result).toEqualIgnoringWhitespace(mocks.alarmCsv);
  });
});
