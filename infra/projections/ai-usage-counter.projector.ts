import { sql } from "drizzle-orm";
import * as AI from "+ai";
import * as Events from "+ai/events";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class AiUsageCounterProjector {
  constructor(eventBus: typeof EventBus) {
    eventBus.on(AI.Events.AI_REQUEST_REGISTERED_EVENT, this.onAiRequestRegisteredEvent.bind(this));
  }

  async onAiRequestRegisteredEvent(event: Events.AiRequestRegisteredEventType) {
    const rules = new AI.QuotaRuleSelector(AI.RULES).select(event.payload);

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
  }
}
