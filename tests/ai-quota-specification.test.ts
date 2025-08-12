import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { BucketCounterDrizzleRepository } from "../modules/ai/repositories/bucket-counter.drizzle";
import { QuotaRuleSelector } from "../modules/ai/services/quota-rule-selector";
import { AIQuotaSpecification } from "../modules/ai/specifications/ai-quota-specification";
import * as VO from "../modules/ai/value-objects";
import * as mocks from "./mocks";

export const userDailyBucket = `user:${mocks.userId}:day:${tools.Day.fromNow().toIsoId()}`;
export const emotionsAlarmEntryBucket = `user:${mocks.userId}:entry:${mocks.entryId}:alarms`;
export const emotionsWeeklyReviewInsightWeeklyBucket = `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_weekly_review_insight`;
export const emotionsAlarmInactivityWeeklyBucket = `user:${mocks.userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_alarm_inactivity`;

describe("AIQuotaSpecification", () => {
  test("EmotionsAlarmEntryContext - no violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 0,
      [emotionsAlarmEntryBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({ violations: [] });
  });

  test("EmotionsAlarmEntryContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 10,
      [emotionsAlarmEntryBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          ruleId: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsAlarmEntryContext - EMOTIONS_ALARM_ENTRY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 2,
      [emotionsAlarmEntryBucket]: 2,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: emotionsAlarmEntryBucket,
          limit: VO.QuotaLimit.parse(2),
          ruleId: "EMOTIONS_ALARM_ENTRY",
          used: 2,
        },
      ],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - no violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 0,
      [emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({ violations: [] });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 10,
      [emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          ruleId: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 1,
      [emotionsWeeklyReviewInsightWeeklyBucket]: 1,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: emotionsWeeklyReviewInsightWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          ruleId: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
          used: 1,
        },
      ],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - no violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 0,
      [emotionsAlarmInactivityWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 10,
      [emotionsAlarmInactivityWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          ruleId: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [userDailyBucket]: 1,
      [emotionsAlarmInactivityWeeklyBucket]: 1,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: emotionsAlarmInactivityWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          ruleId: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
  });
});
