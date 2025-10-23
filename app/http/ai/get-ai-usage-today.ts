import type hono from "hono";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters/ai";

const deps = { BucketCounter: Adapters.BucketCounter };

export async function GetAiUsageToday(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
}
