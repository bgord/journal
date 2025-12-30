import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type { RuleInspectorPort } from "+ai/ports";
import type * as VO from "+ai/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { Clock: bg.ClockPort };

class RuleInspectorDrizzle implements RuleInspectorPort {
  constructor(private readonly deps: Dependencies) {}

  async inspect(rule: VO.QuotaRule, context: VO.RequestContext) {
    const result = await db.query.aiUsageCounters.findFirst({
      columns: { count: true },
      where: eq(Schema.aiUsageCounters.bucket, rule.bucket(context)),
    });

    const count = tools.IntegerNonNegative.parse(result?.count ?? 0);

    return {
      id: rule.id,
      consumed: count >= rule.limit,
      limit: rule.limit,
      count,
      remaining: tools.IntegerNonNegative.parse(rule.limit - count),
      resetsInMs: rule.window.resetsIn(this.deps.Clock).ms,
    };
  }
}

export function createRuleInspector(deps: Dependencies): RuleInspectorPort {
  return new RuleInspectorDrizzle(deps);
}
