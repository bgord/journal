import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";

type Dependencies = { Clock: bg.ClockPort; RuleInspector: AI.Ports.RuleInspectorPort };

export const GetAiUsageToday =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

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
