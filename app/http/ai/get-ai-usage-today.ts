import type hono from "hono";
import * as AI from "+ai";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { Clock: Adapters.Clock, BucketCounter: Adapters.AI.BucketCounter };

export async function GetAiUsageToday(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const context = {
    userId,
    category: AI.UsageCategory.INSPECT,
    timestamp: deps.Clock.nowMs(),
    dimensions: {},
  };

  const result = await deps.BucketCounter.getMany([AI.USER_DAILY_RULE.bucket(context)]);

  return c.json(result);
}
