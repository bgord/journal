import { and, eq, inArray } from "drizzle-orm";
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

  async inspect(rule: VO.QuotaRule, context: VO.RequestContext) {
    const result = await db.query.aiUsageCounters.findFirst({
      columns: { count: true },
      where: and(eq(Schema.aiUsageCounters.bucket, rule.bucket(context))),
    });

    const count = result?.count ?? 0;

    return {
      consumed: count >= rule.limit,
      limit: rule.limit,
      count,
      remaining: rule.limit - count,
    };
  }
}

/** @public */
export const BucketCounter = new BucketCounterDrizzle();
