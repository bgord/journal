import type { BucketCounter } from "+ai/ports/bucket-counter";
import { QuotaRuleSelector } from "+ai/services/quota-rule-selector";
import * as VO from "+ai/value-objects";

type QuotaViolation = {
  id: VO.QuotaRuleId;
  bucket: VO.QuotaBucketType;
  used: VO.QuotaUsageType;
  limit: VO.QuotaLimitType;
};

export class AIQuotaSpecification {
  constructor(
    private readonly selector: QuotaRuleSelector,
    private readonly bucketCounter: BucketCounter,
  ) {}

  async verify<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: QuotaViolation[] }> {
    const quotaRules = this.selector.select(context);
    const buckets = quotaRules.map((rule) => rule.bucket);

    const counts = await this.bucketCounter.getMany(buckets);

    const violations: QuotaViolation[] = quotaRules
      .map((quotaRule) => ({
        id: quotaRule.id,
        bucket: quotaRule.bucket,
        used: counts[quotaRule.bucket] ?? 0,
        limit: quotaRule.limit,
      }))
      .filter((rule) => rule.used >= rule.limit);

    return { violations };
  }
}
