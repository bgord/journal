import { BucketCounterDrizzleRepository } from "+ai/repositories";
import { QuotaRuleSelector } from "+ai/services";
import { QuotaSpecification } from "+ai/specifications";
import * as VO from "+ai/value-objects";
import { describe, expect, spyOn, test } from "bun:test";
import * as mocks from "./mocks";

const selector = new QuotaRuleSelector(VO.RULES);
const bucketCounterRepo = new BucketCounterDrizzleRepository();

const specification = new QuotaSpecification(selector, bucketCounterRepo);

describe("QuotaSpecification", () => {
  test("EmotionsAlarmEntryContext - no violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({ violations: [] });
  });

  test("EmotionsAlarmEntryContext - USER_DAILY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          id: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsAlarmEntryContext - EMOTIONS_ALARM_ENTRY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 2,
      [mocks.emotionsAlarmEntryBucket]: 2,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmEntryBucket,
          limit: VO.QuotaLimit.parse(2),
          id: "EMOTIONS_ALARM_ENTRY",
          used: 2,
        },
      ],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - no violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({ violations: [] });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          id: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 1,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: 1,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsWeeklyReviewInsightWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
          used: 1,
        },
      ],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - no violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 10,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 0,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: mocks.userDailyBucket,
          limit: VO.QuotaLimit.parse(10),
          id: "USER_DAILY",
          used: 10,
        },
      ],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 1,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: 1,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
  });
});
