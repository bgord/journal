import { BucketCounter } from "+ai/ports/bucket-counter";
import * as VO from "+ai/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { inArray } from "drizzle-orm";

export class BucketCounterDrizzleRepository implements BucketCounter {
  async getMany(buckets: VO.QuotaBucketType[]): Promise<Record<VO.QuotaBucketType, VO.QuotaUsageType>> {
    if (buckets.length === 0) return {};

    const rows = await db
      .select({ bucket: Schema.aiUsageCounters.bucket, count: Schema.aiUsageCounters.count })
      .from(Schema.aiUsageCounters)
      .where(inArray(Schema.aiUsageCounters.bucket, buckets));

    const usage: Record<VO.QuotaBucketType, VO.QuotaUsageType> = Object.fromEntries(
      buckets.map((bucket) => [bucket, 0]),
    );

    for (const row of rows) usage[row.bucket] = row.count;

    return usage;
  }
}
