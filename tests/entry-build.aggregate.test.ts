import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Entry.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [], deps);

    expect(entry.pullEvents()).toEqual([]);
  });
});
