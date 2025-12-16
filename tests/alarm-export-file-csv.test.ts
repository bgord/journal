import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("AlarmExportFileCsv", async () => {
  const di = await bootstrap();

  test("generates a CSV", async () => {
    const file = new Emotions.Services.AlarmExportFileCsv([mocks.alarm], di.Adapters.System);

    const result = await text(file.create());

    expect(result).toEqualIgnoringWhitespace(mocks.alarmCsv);
  });
});
