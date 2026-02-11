import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReview", async () => {
  const di = await bootstrap();

  test("build new aggregate", () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [], di.Adapters.System);

    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("request - correct path", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
        mocks.weeklyReviewId,
        mocks.previousWeek,
        mocks.userId,
        di.Adapters.System,
      );

      expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewRequestedEvent]);
      expect(weeklyReview.toSnapshot()).toEqual({
        id: mocks.GenericWeeklyReviewRequestedEvent.payload.weeklyReviewId,
        userId: mocks.GenericWeeklyReviewRequestedEvent.payload.userId,
        status: Emotions.VO.WeeklyReviewStatusEnum.requested,
        week: tools.Week.fromIsoId(mocks.GenericWeeklyReviewRequestedEvent.payload.weekIsoId),
        insights: undefined,
      });
    });
  });

  test("complete - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      di.Adapters.System,
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

  test("complete - WeeklyReviewCompletedOnce", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent, mocks.GenericWeeklyReviewCompletedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(mocks.insights)).toThrow(
        Emotions.Invariants.WeeklyReviewCompletedOnce.error,
      );
    });
    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("fail - correct path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      di.Adapters.System,
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

  test("fail - WeeklyReviewCompletedOnce", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent, mocks.GenericWeeklyReviewFailedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(mocks.insights)).toThrow(
        Emotions.Invariants.WeeklyReviewCompletedOnce.error,
      );
    });
    expect(weeklyReview.pullEvents()).toEqual([]);
  });
});
