import { eq } from "drizzle-orm";
import type { RuleInspectorPort } from "+ai/ports";
import type * as VO from "+ai/value-objects";
import { Clock } from "+infra/adapters/clock.adapter";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

const deps = { Clock };

class RuleInspectorDrizzle implements RuleInspectorPort {
  async inspect(rule: VO.QuotaRule, context: VO.RequestContext) {
    const result = await db.query.aiUsageCounters.findFirst({
      columns: { count: true },
      where: eq(Schema.aiUsageCounters.bucket, rule.bucket(context)),
    });

    const count = result?.count ?? 0;

    return {
      id: rule.id,
      consumed: count >= rule.limit,
      limit: rule.limit,
      count,
      remaining: rule.limit - count,
      resetsInMs: rule.window.resetsIn(deps.Clock).ms,
    };
  }
}

/** @public */
export const RuleInspector = new RuleInspectorDrizzle();
