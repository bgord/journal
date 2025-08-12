// modules/ai/specifications/ai-quota.spec.ts

import type { BucketCounter } from "+ai/ports/bucket-counter";
import { QuotaRuleSelector } from "+ai/services/quota-rule-selector";
import type { RequestContext } from "+ai/value-objects/request-context";
import type { UsageCategory } from "+ai/value-objects/usage-category";

export type QuotaViolation = Readonly<{
  ruleId: string;
  bucket: string;
  used: number;
  limit: number;
}>;

export class AIQuotaSpecification {
  constructor(
    private readonly selector: QuotaRuleSelector,
    private readonly bucketCounter: BucketCounter,
  ) {}

  async verify<C extends UsageCategory>(
    context: RequestContext<C>,
  ): Promise<{ violations: QuotaViolation[] }> {
    const quotaRules = this.selector.select(context);
    const buckets = quotaRules.map((rule) => rule.bucket);

    const counts = await this.bucketCounter.getMany(buckets);

    const violations: QuotaViolation[] = quotaRules
      .map((quotaRule) => ({
        ruleId: quotaRule.id,
        bucket: quotaRule.bucket,
        used: counts[quotaRule.bucket] ?? 0,
        limit: quotaRule.limit,
      }))
      .filter((rule) => rule.used >= rule.limit);

    return { violations };
  }
}
