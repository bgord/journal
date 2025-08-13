import * as Events from "+ai/events";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { sql } from "drizzle-orm";
import { QuotaRuleSelector } from "../services/quota-rule-selector";
import { RULES } from "../value-objects/quota-rules";

export const onAiRequestRegisteredEvent = async (event: Events.AiRequestRegisteredEventType) => {
  const rules = new QuotaRuleSelector(RULES).select(event.payload);

  await db
    .insert(Schema.aiUsageCounters)
    .values(
      rules.map((rule) => ({
        bucket: rule.bucket,
        ruleId: rule.id,
        window: rule.window,
        userId: event.payload.userId,
        count: 1,
        firstEventAt: event.payload.timestamp,
        lastEventAt: event.payload.timestamp,
      })),
    )
    .onConflictDoUpdate({
      target: Schema.aiUsageCounters.bucket,
      set: {
        count: sql`${Schema.aiUsageCounters.count} + 1`,
        lastEventAt: event.payload.timestamp,
      },
    });
};
