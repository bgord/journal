import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReview.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [], deps);

    expect(weeklyReview.pullEvents()).toEqual([]);
  });
});
