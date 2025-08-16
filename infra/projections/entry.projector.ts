import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class EntryProjector {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Emotions.Events.SITUATION_LOGGED_EVENT, this.onSituationLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, this.onEmotionLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.REACTION_LOGGED_EVENT, this.onReactionLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.EMOTION_REAPPRAISED_EVENT, this.onEmotionReappraisedEvent.bind(this));
    this.eventBus.on(Emotions.Events.REACTION_EVALUATED_EVENT, this.onReactionEvaluatedEvent.bind(this));
    this.eventBus.on(Emotions.Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
    this.eventBus.on(
      Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
      this.onTimeCapsuleEntryScheduledEvent.bind(this),
    );
  }

  onSituationLoggedEvent = async (event: Emotions.Events.SituationLoggedEventType) => {
    await db.insert(Schema.entries).values({
      id: event.payload.entryId,
      status: Emotions.VO.EntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
      revision: event.revision,
      language: event.payload.language,
      weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
      userId: event.payload.userId,
      origin: event.payload.origin,
    });

    const isTimeCapsule = await Emotions.Repos.TimeCapsuleEntryRepository.getById(event.payload.entryId);

    if (isTimeCapsule) {
      await db
        .update(Schema.timeCapsuleEntries)
        .set({ status: Emotions.VO.TimeCapsuleEntryStatusEnum.published })
        .where(eq(Schema.timeCapsuleEntries.id, event.payload.entryId));
    }
  };

  onEmotionLoggedEvent = async (event: Emotions.Events.EmotionLoggedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  };

  onReactionLoggedEvent = async (event: Emotions.Events.ReactionLoggedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  };

  onEmotionReappraisedEvent = async (event: Emotions.Events.EmotionReappraisedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  };

  onReactionEvaluatedEvent = async (event: Emotions.Events.ReactionEvaluatedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  };

  onEntryDeletedEvent = async (event: Emotions.Events.EntryDeletedEventType) => {
    await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));
  };

  onTimeCapsuleEntryScheduledEvent = async (event: Emotions.Events.TimeCapsuleEntryScheduledEventType) => {
    await db.insert(Schema.timeCapsuleEntries).values({
      id: event.payload.entryId,
      scheduledAt: event.payload.scheduledAt,
      scheduledFor: event.payload.scheduledFor,
      situationKind: event.payload.situation.kind,
      situationDescription: event.payload.situation.description,
      situationLocation: event.payload.situation.location,
      emotionLabel: event.payload.emotion.label,
      emotionIntensity: event.payload.emotion.intensity as number,
      reactionDescription: event.payload.reaction.description,
      reactionType: event.payload.reaction.type,
      reactionEffectiveness: event.payload.reaction.effectiveness,
      language: event.payload.language,
      status: Emotions.VO.TimeCapsuleEntryStatusEnum.scheduled,
      userId: event.payload.userId,
    });
  };
}
