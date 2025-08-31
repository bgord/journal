import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { Clock: Adapters.Clock };

describe("EntryExportFileText", () => {
  test("generates a CSV", async () => {
    const file = new Emotions.Services.EntryExportFileText([mocks.fullEntry], deps);
    const result = file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.entryText);
  });
});
