import type * as bg from "@bgord/bun";
import { sql } from "drizzle-orm";
import * as AI from "+ai";
import type * as Events from "+ai/events";
import type { EventBusType } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: EventBusType; EventHandler: bg.EventHandlerStrategy };

export class AiUsageCounterProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      AI.Events.AI_REQUEST_REGISTERED_EVENT,
      deps.EventHandler.handle(this.onAiRequestRegisteredEvent.bind(this)),
    );
  }

  async onAiRequestRegisteredEvent(event: Events.AiRequestRegisteredEventType) {
    const rules = new AI.QuotaRuleSelector(AI.RULES).select(event.payload);

    await db
      .insert(Schema.aiUsageCounters)
      .values(
        rules.map((rule) => ({
          bucket: rule.bucket,
          ruleId: rule.id,
          window: rule.window.value,
          userId: event.payload.userId,
          count: 1,
          firstEventAt: event.payload.timestamp,
          lastEventAt: event.payload.timestamp,
        })),
      )
      .onConflictDoUpdate({
        target: Schema.aiUsageCounters.bucket,
        set: { count: sql`${Schema.aiUsageCounters.count} + 1`, lastEventAt: event.payload.timestamp },
      });
  }
}
