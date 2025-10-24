import type * as VO from "+ai/value-objects";

export interface BucketCounterPort {
  getMany(buckets: VO.QuotaBucketType[]): Promise<Record<VO.QuotaBucketType, VO.QuotaUsageType>>;

  inspect(rule: VO.QuotaRule, context: VO.RequestContext): Promise<VO.QuotaRuleInspectionType>;
}
