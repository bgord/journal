import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import { QuotaRuleSelector } from "+ai/services/quota-rule-selector";
import * as VO from "+ai/value-objects";
import * as mocks from "./mocks";

const ten = v.parse(VO.QuotaLimit, 10);

describe("QuotaRuleSelector", () => {
  test("EmotionsAlarmEntryContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    expect(selector.select(mocks.EmotionsAlarmEntryContext)).toEqual([
      {
        bucket: mocks.userDailyBucket,
        id: "USER_DAILY",
        limit: ten,
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.DAY),
      },
      {
        bucket: mocks.emotionsAlarmEntryBucket,
        id: "EMOTIONS_ALARM_ENTRY",
        limit: v.parse(VO.QuotaLimit, 2),
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.ALL_TIME),
      },
    ]);
  });

  test("EmotionsWeeklyReviewInsightContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    expect(selector.select(mocks.EmotionsWeeklyReviewInsightContext)).toEqual([
      {
        bucket: mocks.userDailyBucket,
        id: "USER_DAILY",
        limit: ten,
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.DAY),
      },
      {
        bucket: mocks.emotionsWeeklyReviewInsightWeeklyBucket,
        id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
        limit: v.parse(VO.QuotaLimit, 1),
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.WEEK),
      },
    ]);
  });

  test("EmotionsAlarmInactivityWeeklyContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    expect(selector.select(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual([
      {
        bucket: mocks.userDailyBucket,
        id: "USER_DAILY",
        limit: ten,
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.DAY),
      },
      {
        bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
        id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
        limit: v.parse(VO.QuotaLimit, 1),
        window: new VO.QuotaWindow(VO.QuotaWindowEnum.WEEK),
      },
    ]);
  });
});
