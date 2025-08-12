import type { QuotaBucketType } from "+ai/value-objects/quota-bucket";
import type { QuotaUsageType } from "+ai/value-objects/quota-usage";

export interface BucketCounter {
  getMany(buckets: QuotaBucketType[]): Promise<Record<QuotaBucketType, QuotaUsageType>>;
}
