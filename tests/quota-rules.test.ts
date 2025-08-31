import { describe, expect, test } from "bun:test";
import * as VO from "+ai/value-objects";
import * as mocks from "./mocks";

describe("Quota rules", () => {
  test("USER_DAILY_RULE matches every context", () => {
    expect(VO.USER_DAILY_RULE.appliesTo(mocks.EmotionsAlarmEntryContext.category)).toEqual(true);
    expect(VO.USER_DAILY_RULE.bucket(mocks.EmotionsAlarmEntryContext)).toEqual(mocks.userDailyBucket);
  });

  test("EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE - match", () => {
    expect(
      VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.appliesTo(
        mocks.EmotionsWeeklyReviewInsightContext.category,
      ),
    ).toEqual(true);
    expect(
      VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.bucket(mocks.EmotionsWeeklyReviewInsightContext),
    ).toEqual(mocks.emotionsWeeklyReviewInsightWeeklyBucket);
  });

  test("EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE - no match", () => {
    expect(
      VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.appliesTo(mocks.EmotionsAlarmEntryContext.category),
    ).toEqual(false);
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE - match", () => {
    expect(
      VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.appliesTo(mocks.EmotionsAlarmInactivityWeeklyContext.category),
    ).toEqual(true);
    expect(
      VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.bucket(mocks.EmotionsAlarmInactivityWeeklyContext),
    ).toEqual(mocks.emotionsAlarmInactivityWeeklyBucket);
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE - no match", () => {
    expect(
      VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.appliesTo(mocks.EmotionsAlarmEntryContext.category),
    ).toEqual(false);
  });

  test("EMOTIONS_ALARM_ENTRY_RULE - match", () => {
    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.appliesTo(mocks.EmotionsAlarmEntryContext.category)).toEqual(true);
    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.bucket(mocks.EmotionsAlarmEntryContext)).toEqual(
      mocks.emotionsAlarmEntryBucket,
    );
  });

  test("EMOTIONS_ALARM_ENTRY_RULE - no match", () => {
    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.appliesTo(mocks.EmotionsWeeklyReviewInsightContext.category)).toEqual(
      false,
    );
  });
});
