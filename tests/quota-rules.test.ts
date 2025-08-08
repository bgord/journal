import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as VO from "../modules/ai/value-objects";
import * as mocks from "./mocks";

// TODO: replace with tools.Day
export const day = (ts: number) => new Date(ts).toISOString().slice(0, 10);

const EmotionsAlarmEntryContext: VO.RequestContext<VO.UsageCategory.EMOTIONS_ALARM_ENTRY> = {
  userId: mocks.userId,
  category: VO.UsageCategory.EMOTIONS_ALARM_ENTRY,
  timestamp: tools.Time.Now().value,
  dimensions: { entryId: mocks.entryId },
};

const EmotionsWeeklyReviewInsightContext: VO.RequestContext<VO.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT> =
  {
    userId: mocks.userId,
    category: VO.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };

const EmotionsAlarmInactivityWeeklyContext: VO.RequestContext<VO.UsageCategory.EMOTIONS_ALARM_INACTIVITY> = {
  userId: mocks.userId,
  category: VO.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
  timestamp: tools.Time.Now().value,
  dimensions: {},
};

describe("Quota rules", () => {
  test("USER_DAILY_RULE matches every context", () => {
    expect(VO.USER_DAILY_RULE.appliesTo(EmotionsAlarmEntryContext.category)).toEqual(true);

    expect(VO.USER_DAILY_RULE.bucket(EmotionsAlarmEntryContext)).toEqual(
      `user:${mocks.userId}:day:${day(tools.Time.Now().value)}`,
    );
  });

  test("EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE - match", () => {
    expect(
      VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.appliesTo(EmotionsWeeklyReviewInsightContext.category),
    ).toEqual(true);

    expect(VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.bucket(EmotionsWeeklyReviewInsightContext)).toEqual(
      `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_weekly_review_insight`,
    );
  });

  test("EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE - no match", () => {
    expect(
      VO.EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE.appliesTo(EmotionsAlarmEntryContext.category),
    ).toEqual(false);
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE - match", () => {
    expect(
      VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.appliesTo(EmotionsAlarmInactivityWeeklyContext.category),
    ).toEqual(true);

    expect(VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.bucket(EmotionsAlarmInactivityWeeklyContext)).toEqual(
      `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_alarm_inactivity`,
    );
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE - no match", () => {
    expect(VO.EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE.appliesTo(EmotionsAlarmEntryContext.category)).toEqual(
      false,
    );
  });

  test("EMOTIONS_ALARM_ENTRY_RULE - match", () => {
    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.appliesTo(EmotionsAlarmEntryContext.category)).toEqual(true);

    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.bucket(EmotionsAlarmEntryContext)).toEqual(
      `user:${mocks.userId}:entry:${mocks.entryId}:alarms`,
    );
  });

  test("EMOTIONS_ALARM_ENTRY_RULE - no match", () => {
    expect(VO.EMOTIONS_ALARM_ENTRY_RULE.appliesTo(EmotionsWeeklyReviewInsightContext.category)).toEqual(
      false,
    );
  });
});
