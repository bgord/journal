import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReview.fail", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => weeklyReview.fail());

    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewFailedEvent]);
    expect(weeklyReview.toSnapshot()).toEqual({
      id: mocks.GenericWeeklyReviewRequestedEvent.payload.weeklyReviewId,
      userId: mocks.GenericWeeklyReviewRequestedEvent.payload.userId,
      status: Emotions.VO.WeeklyReviewStatusEnum.failed,
      week: tools.Week.fromIsoId(mocks.GenericWeeklyReviewRequestedEvent.payload.weekIsoId),
      insights: undefined,
    });
  });
});
