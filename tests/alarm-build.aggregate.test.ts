import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", () => {
    expect(Emotions.Aggregates.Alarm.build(mocks.alarmId, [], deps).pullEvents()).toEqual([]);
  });
});
