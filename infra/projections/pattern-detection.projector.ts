import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { EventBusType } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: EventBusType; EventHandler: bg.EventHandlerStrategy };

export class PatternDetectionProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
      deps.EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
      deps.EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
      deps.EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
      deps.EventHandler.handle(this.onPatternDetectedEvent.bind(this)),
    );
  }

  onPatternDetectedEvent = async (event: Emotions.Services.Patterns.PatternDetectionEventType) => {
    await db.insert(Schema.patternDetections).values({
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      weekIsoId: event.payload.weekIsoId,
    });
  };
}
