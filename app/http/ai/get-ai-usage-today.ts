import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as AI from "+ai";
import type * as infra from "+infra";

type Dependencies = { Clock: bg.ClockPort; RuleInspector: AI.Ports.RuleInspectorPort };

export const GetAiUsageToday = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const context = {
    userId,
    category: AI.UsageCategory.INSPECT,
    timestamp: deps.Clock.now().ms,
    dimensions: {},
  };

  const inspection = await deps.RuleInspector.inspect(AI.USER_DAILY_RULE, context);

  return c.json({
    ...inspection,
    resetsInHours: new tools.RoundingToNearestStrategy().round(
      tools.Duration.Ms(inspection.resetsInMs).hours,
    ),
  });
};
