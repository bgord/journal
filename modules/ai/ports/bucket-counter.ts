import type * as VO from "+ai/value-objects";

export interface BucketCounterPort {
  getMany(buckets: ReadonlyArray<VO.QuotaBucketType>): Promise<Record<VO.QuotaBucketType, VO.QuotaUsageType>>;
}
