import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("EntryExportFileMarkdown", async () => {
  const di = await bootstrap(mocks.Env);

  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileMarkdown([mocks.fullEntry], di.Adapters.System);
    const result = file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.entryMarkdown);
  });
});
