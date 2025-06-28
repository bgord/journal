import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

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

    const weekStart = Emotions.VO.WeekStart.fromTimestamp(mocks.weekStartedAt);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await weeklyReview.request(weekStart);
    });

    expect(weeklyReview.pullEvents()).toEqual([mocks.GenericWeeklyReviewRequested]);
  });

  // test("generate - AlarmGeneratedOnce", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

  //   expect(async () =>
  //     alarm._generate(
  //       mocks.emotionJournalEntryId,
  //       Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  //     ),
  //   ).toThrow(Emotions.Policies.AlarmGeneratedOnce.error);

  //   expect(alarm.pullEvents()).toEqual([]);
  // });
});
