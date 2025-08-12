import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import { QuotaRuleSelector } from "../modules/ai/services/quota-rule-selector";
import * as VO from "../modules/ai/value-objects";
import * as mocks from "./mocks";

describe("QuotaRuleSelector", () => {
  test("EmotionsAlarmEntryContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    const result = selector.select(mocks.EmotionsAlarmEntryContext);
    expect(result).toEqual([
      {
        bucket: `user:${mocks.userId}:day:${tools.Day.fromNow().toIsoId()}`,
        id: "USER_DAILY",
        limit: VO.QuotaLimit.parse(10),
        window: VO.QuotaWindow.DAY,
      },
      {
        bucket: `user:${mocks.userId}:entry:${mocks.entryId}:alarms`,
        id: "EMOTIONS_ALARM_ENTRY",
        limit: VO.QuotaLimit.parse(2),
        window: VO.QuotaWindow.ALL_TIME,
      },
    ]);
  });

  test("EmotionsWeeklyReviewInsightContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    const result = selector.select(mocks.EmotionsWeeklyReviewInsightContext);
    expect(result).toEqual([
      {
        bucket: `user:${mocks.userId}:day:${tools.Day.fromTimestamp(tools.Time.Now().value).toIsoId()}`,
        id: "USER_DAILY",
        limit: VO.QuotaLimit.parse(10),
        window: VO.QuotaWindow.DAY,
      },
      {
        bucket: `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_weekly_review_insight`,
        id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
        limit: VO.QuotaLimit.parse(1),
        window: VO.QuotaWindow.WEEK,
      },
    ]);
  });

  test("EmotionsAlarmInactivityWeeklyContext", () => {
    const selector = new QuotaRuleSelector(VO.RULES);

    const result = selector.select(mocks.EmotionsAlarmInactivityWeeklyContext);
    expect(result).toEqual([
      {
        bucket: `user:${mocks.userId}:day:${tools.Day.fromTimestamp(tools.Time.Now().value).toIsoId()}`,
        id: "USER_DAILY",
        limit: VO.QuotaLimit.parse(10),
        window: VO.QuotaWindow.DAY,
      },
      {
        bucket: `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_alarm_inactivity`,
        id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
        limit: VO.QuotaLimit.parse(1),
        window: VO.QuotaWindow.WEEK,
      },
    ]);
  });
});
