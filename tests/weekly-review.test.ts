import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const weekStart = Emotions.VO.WeekStart.fromTimestamp(mocks.weekStartedAt);

describe("WeeklyReview", () => {
  test("create new aggregate", () => {
    expect(() => Emotions.Aggregates.WeeklyReview.create(mocks.weeklyReviewId)).not.toThrow();
  });

  test("build new aggregate", () => {
    const emotionJournalEntry = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, []);

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, []);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await weeklyReview.request(weekStart);
    });

    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewRequestedEvent]);
  });

  test("generate - WeeklyReviewRequestedOnce", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);

    expect(async () => weeklyReview.request(weekStart)).toThrow(
      Emotions.Policies.WeeklyReviewRequestedOnce.error,
    );

    expect(weeklyReview.pullEvents()).toEqual([]);
  });

  test("complete - correct path", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);

    const insights = new Emotions.VO.EmotionalAdvice("Good job");

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await weeklyReview.complete(insights);
    });

    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewCompletedEvent]);
  });
});
