import { inArray } from "drizzle-orm";
import type { BucketCounterPort } from "+ai/ports/bucket-counter";
import type * as VO from "+ai/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class BucketCounterDrizzle implements BucketCounterPort {
  async getMany(buckets: VO.QuotaBucketType[]) {
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

export const BucketCounter = new BucketCounterDrizzle();
