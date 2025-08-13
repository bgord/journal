import type * as Ports from "+ai/ports";
import * as Services from "+ai/services";
import * as VO from "+ai/value-objects";

export type QuotaViolation = {
  id: VO.QuotaRuleId;
  bucket: VO.QuotaBucketType;
  used: VO.QuotaUsageType;
  limit: VO.QuotaLimitType;
};

export class AIQuotaSpecification {
  constructor(
    private readonly selector: Services.QuotaRuleSelector,
    private readonly bucketCounter: Ports.BucketCounter,
  ) {}

  async verify<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: QuotaViolation[] }> {
    const quotaRules = this.selector.select(context);
    const buckets = quotaRules.map((rule) => rule.bucket);

    const counts = await this.bucketCounter.getMany(buckets);

    const violations: QuotaViolation[] = quotaRules
      .map((rule) => ({
        id: rule.id,
        bucket: rule.bucket,
        used: counts[rule.bucket] ?? 0,
        limit: rule.limit,
      }))
      .filter((rule) => rule.used >= rule.limit);

    return { violations };
  }
}
