import * as bg from "@bgord/bun";
import Emittery from "emittery";
import z from "zod/v4";
import * as EmotionEvents from "../modules/emotions/events";
import * as EmotionHandlers from "../modules/emotions/handlers";
import type { AcceptedEvent } from "./event-store";
import { logger } from "./logger";

const EventLogger = new bg.EventLogger(logger);

export const EventBus = new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

// Emotion journal entry

EventBus.on(EmotionEvents.EMOTION_JOURNAL_ENTRY_DELETED, EmotionHandlers.onEmotionJournalEntryDeletedEvent);

EventBus.on(EmotionEvents.EMOTION_REAPPRAISED_EVENT, EmotionHandlers.onEmotionReappraisedEvent);

EventBus.on(EmotionEvents.EMOTION_LOGGED_EVENT, EmotionHandlers.onEmotionLoggedEvent);

EventBus.on(EmotionEvents.REACTION_EVALUATED_EVENT, EmotionHandlers.onReactionEvaluatedEvent);

EventBus.on(EmotionEvents.REACTION_LOGGED_EVENT, EmotionHandlers.onReactionLoggedEvent);

EventBus.on(EmotionEvents.SITUATION_LOGGED_EVENT, EmotionHandlers.onSituationLoggedEvent);

// Pattern detection

EventBus.on(
  EmotionEvents.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EmotionHandlers.onMoreNegativeThanPositiveEmotionsPatternDetectedEvent,
);

EventBus.on(
  EmotionEvents.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EmotionHandlers.onMultipleMaladaptiveReactionsPatternDetectedEvent,
);

EventBus.on(
  EmotionEvents.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EmotionHandlers.onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
);
