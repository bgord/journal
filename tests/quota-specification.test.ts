import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { QuotaSpecification } from "+ai/specifications";
import * as VO from "+ai/value-objects";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const noUsage = tools.IntegerNonNegative.parse(0);

describe("QuotaSpecification", async () => {
  const di = await bootstrap();
  const specification = new QuotaSpecification(di.Adapters.AI.BucketCounter);

  test("EmotionsAlarmEntryContext - no violations", async () => {
    const bucketCounterGetMany = spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: noUsage,
      [mocks.emotionsAlarmEntryBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({ violations: [] });
    expect(bucketCounterGetMany).toHaveBeenCalledWith([
      mocks.userDailyBucket,
      mocks.emotionsAlarmEntryBucket,
    ]);
  });

  test("EmotionsAlarmEntryContext - USER_DAILY violations", async () => {
    const used = tools.IntegerNonNegative.parse(10);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsAlarmEntryBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [{ bucket: mocks.userDailyBucket, limit: VO.QuotaLimit.parse(10), id: "USER_DAILY", used }],
    });
  });

  test("EmotionsAlarmEntryContext - EMOTIONS_ALARM_ENTRY violations", async () => {
    const used = tools.IntegerNonNegative.parse(2);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsAlarmEntryBucket]: used,
    });

    expect(await specification.verify(mocks.EmotionsAlarmEntryContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmEntryBucket,
          limit: VO.QuotaLimit.parse(2),
          id: "EMOTIONS_ALARM_ENTRY",
          used,
        },
      ],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - no violations", async () => {
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: noUsage,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({ violations: [] });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    const used = tools.IntegerNonNegative.parse(10);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [{ bucket: mocks.userDailyBucket, limit: VO.QuotaLimit.parse(10), id: "USER_DAILY", used }],
    });
  });

  test("EmotionsWeeklyReviewInsightContext - USER_DAILY violations", async () => {
    const used = tools.IntegerNonNegative.parse(1);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsWeeklyReviewInsightWeeklyBucket]: used,
    });

    expect(await specification.verify(mocks.EmotionsWeeklyReviewInsightContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsWeeklyReviewInsightWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
          used,
        },
      ],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - no violations", async () => {
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: noUsage,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    const used = tools.IntegerNonNegative.parse(10);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: noUsage,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [{ bucket: mocks.userDailyBucket, limit: VO.QuotaLimit.parse(10), id: "USER_DAILY", used }],
    });
  });

  test("EmotionsAlarmInactivityWeeklyContext - USER_DAILY violations", async () => {
    const used = tools.IntegerNonNegative.parse(1);
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: used,
      [mocks.emotionsAlarmInactivityWeeklyBucket]: used,
    });

    expect(await specification.verify(mocks.EmotionsAlarmInactivityWeeklyContext)).toEqual({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: VO.QuotaLimit.parse(1),
          id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used,
        },
      ],
    });
  });
});
