import * as tools from "@bgord/tools";
import type hono from "hono";
import * as AI from "+ai";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { Clock: Adapters.Clock, RuleInspector: Adapters.AI.RuleInspector };

export async function GetAiUsageToday(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const context = {
    userId,
    category: AI.UsageCategory.INSPECT,
    timestamp: deps.Clock.nowMs(),
    dimensions: {},
  };

  const inspection = await deps.RuleInspector.inspect(AI.USER_DAILY_RULE, context);

  return c.json({
    ...inspection,
    resetsInHours: new tools.RoundToNearest().round(tools.Duration.Ms(inspection.resetsInMs).hours),
  });
}
