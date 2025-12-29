import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import type { EventBusType } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: EventBusType; EventHandler: bg.EventHandlerStrategy };

export class EntryProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.SITUATION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onSituationLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.EMOTION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onEmotionLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.REACTION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onReactionLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      deps.EventHandler.handle(this.onEmotionReappraisedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.REACTION_EVALUATED_EVENT,
      deps.EventHandler.handle(this.onReactionEvaluatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.ENTRY_DELETED_EVENT,
      deps.EventHandler.handle(this.onEntryDeletedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
      this.onTimeCapsuleEntryScheduledEvent.bind(this),
    );
  }

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    await db.insert(Schema.entries).values({
      id: event.payload.entryId,
      status: Emotions.VO.EntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      revision: event.revision,
      weekIsoId: tools.Week.fromTimestampValue(event.createdAt).toIsoId(),
      userId: event.payload.userId,
      origin: event.payload.origin,
    });

    const isTimeCapsule = await db.query.timeCapsuleEntries.findFirst({
      where: eq(Schema.timeCapsuleEntries.id, event.payload.entryId),
    });

    if (isTimeCapsule) {
      await db
        .update(Schema.timeCapsuleEntries)
        .set({ status: Emotions.VO.TimeCapsuleEntryStatusEnum.published })
        .where(eq(Schema.timeCapsuleEntries.id, event.payload.entryId));
    }
  }

  async onEmotionLoggedEvent(event: Emotions.Events.EmotionLoggedEventType) {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  async onReactionLoggedEvent(event: Emotions.Events.ReactionLoggedEventType) {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  async onEmotionReappraisedEvent(event: Emotions.Events.EmotionReappraisedEventType) {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  async onReactionEvaluatedEvent(event: Emotions.Events.ReactionEvaluatedEventType) {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  async onEntryDeletedEvent(event: Emotions.Events.EntryDeletedEventType) {
    await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));
  }

  async onTimeCapsuleEntryScheduledEvent(event: Emotions.Events.TimeCapsuleEntryScheduledEventType) {
    await db.insert(Schema.timeCapsuleEntries).values({
      id: event.payload.entryId,
      scheduledAt: event.payload.scheduledAt,
      scheduledFor: event.payload.scheduledFor,
      situationKind: event.payload.situation.kind,
      situationDescription: event.payload.situation.description,
      emotionLabel: event.payload.emotion.label,
      emotionIntensity: event.payload.emotion.intensity,
      reactionDescription: event.payload.reaction.description,
      reactionType: event.payload.reaction.type,
      reactionEffectiveness: event.payload.reaction.effectiveness,
      status: Emotions.VO.TimeCapsuleEntryStatusEnum.scheduled,
      userId: event.payload.userId,
    });
  }
}
