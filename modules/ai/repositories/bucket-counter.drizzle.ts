import { BucketCounter } from "+ai/ports/bucket-counter";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { inArray } from "drizzle-orm";

export class BucketCounterDrizzleRepository implements BucketCounter {
  async getMany(keys: string[]): Promise<Record<string, number>> {
    if (keys.length === 0) return {};

    const rows = await db
      .select({ key: Schema.aiUsageCounters.key, count: Schema.aiUsageCounters.count })
      .from(Schema.aiUsageCounters)
      .where(inArray(Schema.aiUsageCounters, keys));

    const buckets: Record<string, number> = Object.fromEntries(keys.map((key) => [key, 0]));

    for (const row of rows) buckets[row.key] = row.count;

    return buckets;
  }
}
