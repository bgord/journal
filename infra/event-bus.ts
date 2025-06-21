import * as bg from "@bgord/bun";
import Emittery from "emittery";
import z from "zod/v4";
import * as EmotionEvents from "../modules/emotions/events";
import * as EmotionHandlers from "../modules/emotions/handlers";
import type { AcceptedEvent } from "./event-store";
import { logger } from "./logger";

const EventLogger = new bg.EventLogger(logger);
const EventHandler = new bg.EventHandler(logger);

export const EventBus = new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

// Emotion journal entry

EventBus.on(
  EmotionEvents.EMOTION_JOURNAL_ENTRY_DELETED,
  EventHandler.handle(EmotionHandlers.onEmotionJournalEntryDeletedEvent),
);

EventBus.on(
  EmotionEvents.EMOTION_REAPPRAISED_EVENT,
  EventHandler.handle(EmotionHandlers.onEmotionReappraisedEvent),
);

EventBus.on(
  EmotionEvents.EMOTION_LOGGED_EVENT,
  EventHandler.handle(EmotionHandlers.onEmotionLoggedEvent),
);

EventBus.on(
  EmotionEvents.REACTION_EVALUATED_EVENT,
  EventHandler.handle(EmotionHandlers.onReactionEvaluatedEvent),
);

EventBus.on(
  EmotionEvents.REACTION_LOGGED_EVENT,
  EventHandler.handle(EmotionHandlers.onReactionLoggedEvent),
);

EventBus.on(
  EmotionEvents.SITUATION_LOGGED_EVENT,
  EventHandler.handle(EmotionHandlers.onSituationLoggedEvent),
);

// Pattern detection

EventBus.on(
  EmotionEvents.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(
    EmotionHandlers.onMoreNegativeThanPositiveEmotionsPatternDetectedEvent,
  ),
);

EventBus.on(
  EmotionEvents.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(
    EmotionHandlers.onMultipleMaladaptiveReactionsPatternDetectedEvent,
  ),
);

EventBus.on(
  EmotionEvents.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EventHandler.handle(
    EmotionHandlers.onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
  ),
);
