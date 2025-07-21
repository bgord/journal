import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const weekStart = Emotions.VO.WeekStart.fromTimestamp(mocks.weekStartedAt);

const insights = new Emotions.VO.Advice("Good job");

describe("WeeklyReview", () => {
  test("build new aggregate", () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, []);

    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("request - correct path", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
        mocks.weeklyReviewId,
        weekStart,
        mocks.userId,
      );

      expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewRequestedEvent]);
    });
  });

  test("complete - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      weeklyReview.complete(insights);
      expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewCompletedEvent]);
    });
  });

  test("complete - WeeklyReviewCompletedOnce", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
      mocks.GenericWeeklyReviewCompletedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(insights)).toThrow(
        Emotions.Policies.WeeklyReviewCompletedOnce.error,
      );
    });

    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("fail - correct path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      weeklyReview.fail();
      expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewFailedEvent]);
    });
  });

  test("fail - WeeklyReviewCompletedOnce", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
      mocks.GenericWeeklyReviewFailedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => weeklyReview.complete(insights)).toThrow(
        Emotions.Policies.WeeklyReviewCompletedOnce.error,
      );
    });

    expect(weeklyReview.pullEvents()).toEqual([]);
  });
});
