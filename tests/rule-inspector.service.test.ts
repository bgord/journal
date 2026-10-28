import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as AI from "+ai";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("RuleInspector", async () => {
  const di = await bootstrap();

  test("happy path", async () => {
    using bucketCounterGetMany = spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: tools.Int.nonNegative(3),
    });

    const result = await di.Adapters.AI.RuleInspector.inspect(AI.USER_DAILY_RULE, mocks.AiUsageContext);

    expect(result).toEqual({
      id: "USER_DAILY",
      consumed: false,
      limit: v.parse(AI.QuotaLimit, 10),
      count: tools.Int.nonNegative(3),
      remaining: tools.Int.nonNegative(7),
      resetsInMs: tools.Duration.Ms(86_399_999).ms,
    });
    expect(bucketCounterGetMany).toHaveBeenCalledWith([mocks.userDailyBucket]);
  });

  test("happy path - consumed", async () => {
    using _ = spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: tools.Int.nonNegative(10),
    });

    const result = await di.Adapters.AI.RuleInspector.inspect(AI.USER_DAILY_RULE, mocks.AiUsageContext);

    expect(result).toEqual({
      id: "USER_DAILY",
      consumed: true,
      limit: v.parse(AI.QuotaLimit, 10),
      count: tools.Int.nonNegative(10),
      remaining: tools.Int.nonNegative(0),
      resetsInMs: tools.Duration.Ms(86_399_999).ms,
    });
  });
});
