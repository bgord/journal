import type * as Ports from "+ai/ports";
import * as Services from "+ai/services";
import * as VO from "+ai/value-objects";

export type QuotaViolation = {
  id: VO.QuotaRuleId;
  bucket: VO.QuotaBucketType;
  used: VO.QuotaUsageType;
  limit: VO.QuotaLimitType;
};

export class QuotaSpecification {
  constructor(private readonly bucketCounter: Ports.BucketCounterPort) {}

  async verify<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: QuotaViolation[] }> {
    const rules = new Services.QuotaRuleSelector(VO.RULES).select(context);
    const buckets = rules.map((rule) => rule.bucket);

    const counts = await this.bucketCounter.getMany(buckets);

    const violations: QuotaViolation[] = rules
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
