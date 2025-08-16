import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class PatternDetectionProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Emotions.Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
      EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
      EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
      EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
      EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
  }

  onPatternDetectedEvent = async (event: Emotions.Services.Patterns.PatternDetectionEventType) => {
    await db.insert(Schema.patternDetections).values({
      id: event.id,
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      weekIsoId: event.payload.weekIsoId,
    });
  };
}
