import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReview.complete", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => weeklyReview.complete(mocks.insights));

    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewCompletedEvent]);
    expect(weeklyReview.toSnapshot()).toEqual({
      id: mocks.GenericWeeklyReviewRequestedEvent.payload.weeklyReviewId,
      userId: mocks.GenericWeeklyReviewRequestedEvent.payload.userId,
      status: Emotions.VO.WeeklyReviewStatusEnum.completed,
      week: tools.Week.fromIsoId(mocks.GenericWeeklyReviewRequestedEvent.payload.weekIsoId),
      insights: new AI.Advice(mocks.GenericWeeklyReviewCompletedEvent.payload.insights),
    });
  });

  test("WeeklyReviewCompletedOnce - already completed", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent, mocks.GenericWeeklyReviewCompletedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(mocks.insights)).toThrow(
        Emotions.Invariants.WeeklyReviewCompletedOnce.error,
      );
    });
    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("WeeklyReviewCompletedOnce - already failed", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent, mocks.GenericWeeklyReviewFailedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(mocks.insights)).toThrow(
        Emotions.Invariants.WeeklyReviewCompletedOnce.error,
      );
    });
    expect(weeklyReview.pullEvents()).toEqual([]);
  });
});
