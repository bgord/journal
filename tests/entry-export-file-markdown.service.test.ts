import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("EntryExportFileMarkdown", async () => {
  const di = await bootstrap();

  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileMarkdown(
      [mocks.fullEntry, mocks.fullEntry],
      di.Adapters.System,
    );

    expect(await file.create()).toEqual(`${mocks.entryMarkdown}\n${mocks.entryMarkdown}`);
  });
});
