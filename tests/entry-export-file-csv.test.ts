import { describe, expect, test } from "bun:test";
import { text } from "node:stream/consumers";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { EnvironmentLoader } from "+infra/env";
import * as mocks from "./mocks";

describe("EntryExportFileCsv", async () => {
  const di = await bootstrap(await EnvironmentLoader.load());

  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileCsv([mocks.fullEntry], di.Adapters.System);
    const result = await text(file.create());

    expect(result).toEqualIgnoringWhitespace(mocks.entryCsv);
  });
});
