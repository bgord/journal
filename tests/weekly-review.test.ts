import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

describe("WeeklyReview", () => {
  test("build new aggregate", () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [], deps);
    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("request - correct path", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
        mocks.weeklyReviewId,
        mocks.previousWeek,
        mocks.userId,
        deps,
      );
      expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewRequestedEvent]);
    });
  });

  test("complete - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => weeklyReview.complete(mocks.insights));
    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("complete - WeeklyReviewCompletedOnce", async () => {
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

  test("fail - correct path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(
      mocks.weeklyReviewId,
      [mocks.GenericWeeklyReviewRequestedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => weeklyReview.fail());
    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("fail - WeeklyReviewCompletedOnce", async () => {
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
