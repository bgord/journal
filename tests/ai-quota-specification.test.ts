import { describe, expect, spyOn, test } from "bun:test";
import { BucketCounterDrizzleRepository } from "../modules/ai/repositories/bucket-counter.drizzle";
import { QuotaRuleSelector } from "../modules/ai/services/quota-rule-selector";
import { AIQuotaSpecification } from "../modules/ai/specifications/ai-quota-specification";
import * as VO from "../modules/ai/value-objects";
import * as mocks from "./mocks";

describe("AIQuotaSpecification", () => {
  test("EmotionsAlarmEntryContext - no violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({ violations: [] });
  });

  test("EmotionsAlarmEntryContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
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
      [mocks.userDailyBucket]: 2,
      [mocks.emotionsAlarmEntryBucket]: 2,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmEntryBucket,
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
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({ violations: [] });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    const selector = new QuotaRuleSelector(VO.RULES);
    const bucketCounterRepo = new BucketCounterDrizzleRepository();

    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
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
      [mocks.userDailyBucket]: 1,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 1,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsWeeklyReviewInsightWeeklyBucket,
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
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 0,
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
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 0,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
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
      [mocks.userDailyBucket]: 1,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 1,
    });

    const specification = new AIQuotaSpecification(selector, bucketCounterRepo);
    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          ruleId: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
  });
});
