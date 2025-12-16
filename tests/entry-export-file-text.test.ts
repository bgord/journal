import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("EntryExportFileText", async () => {
  const di = await bootstrap();

  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileText([mocks.fullEntry], di.Adapters.System);

    const result = file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.entryText);
  });
});
