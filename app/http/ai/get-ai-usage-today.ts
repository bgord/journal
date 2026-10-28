import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import type { QuotaRuleInspectionType } from "+ai/value-objects";

type Dependencies = { Clock: bg.ClockPort; RuleInspector: AI.RuleInspector };

export type AiUsageTodayType = QuotaRuleInspectionType & { resetsInHours: number };

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

    const result: AiUsageTodayType = {
      ...inspection,
      resetsInHours: new tools.RoundingToNearestStrategy().round(
        tools.Duration.Ms(inspection.resetsInMs).hours,
      ),
    };

    return Response.json(result);
  };
