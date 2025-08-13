import type * as VO from "+ai/value-objects";

export interface BucketCounter {
  getMany(buckets: VO.QuotaBucketType[]): Promise<Record<VO.QuotaBucketType, VO.QuotaUsageType>>;
}
