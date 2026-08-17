import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as AI from "+ai";
import type * as infra from "+infra";

type Dependencies = { Clock: bg.ClockPort; RuleInspector: AI.Ports.RuleInspectorPort };

export const GetAiUsageToday = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);

  const userId = context.identity.userId() as bg.UUIDType;

  const inspection = await deps.RuleInspector.inspect(AI.USER_DAILY_RULE, {
    userId,
    category: AI.UsageCategory.INSPECT,
    timestamp: deps.Clock.now().ms,
    dimensions: {},
  });

  return Response.json({
    ...inspection,
    resetsInHours: new tools.RoundingToNearestStrategy().round(
      tools.Duration.Ms(inspection.resetsInMs).hours,
    ),
  });
};
