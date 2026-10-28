import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Ports from "+ai/ports";
import type * as VO from "+ai/value-objects";

type Dependencies = { BucketCounter: Ports.BucketCounterPort; Clock: bg.ClockPort };

export class RuleInspector {
  constructor(private readonly deps: Dependencies) {}

  async inspect(rule: VO.QuotaRule, context: VO.RequestContext): Promise<VO.QuotaRuleInspectionType> {
    const bucket = rule.bucket(context);
    const counts = await this.deps.BucketCounter.getMany([bucket]);

    const count = counts[bucket] ?? tools.Int.nonNegative(0);

    return {
      id: rule.id,
      consumed: count >= rule.limit,
      limit: rule.limit,
      count,
      remaining: tools.Int.nonNegative(rule.limit - count),
      resetsInMs: rule.window.resetsIn(this.deps.Clock).ms,
    };
  }
}
