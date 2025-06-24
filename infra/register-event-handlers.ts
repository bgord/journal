import * as bg from "@bgord/bun";
import * as EmotionEvents from "../modules/emotions/events";
import * as EmotionHandlers from "../modules/emotions/handlers";
import * as Sagas from "../modules/emotions/sagas";
import { EventBus } from "./event-bus";
import { logger } from "./logger";
import { OpenAiClient } from "./open-ai-client";

const EventHandler = new bg.EventHandler(logger);
const OpenAI = new OpenAiClient();

// Emotion journal entry

EventBus.on(
  EmotionEvents.EMOTION_JOURNAL_ENTRY_DELETED,
  EventHandler.handle(EmotionHandlers.onEmotionJournalEntryDeletedEvent),
);

EventBus.on(
  EmotionEvents.EMOTION_REAPPRAISED_EVENT,
  EventHandler.handle(EmotionHandlers.onEmotionReappraisedEvent),
);

EventBus.on(EmotionEvents.EMOTION_LOGGED_EVENT, EventHandler.handle(EmotionHandlers.onEmotionLoggedEvent));

EventBus.on(
  EmotionEvents.REACTION_EVALUATED_EVENT,
  EventHandler.handle(EmotionHandlers.onReactionEvaluatedEvent),
);

EventBus.on(EmotionEvents.REACTION_LOGGED_EVENT, EventHandler.handle(EmotionHandlers.onReactionLoggedEvent));

EventBus.on(
  EmotionEvents.SITUATION_LOGGED_EVENT,
  EventHandler.handle(EmotionHandlers.onSituationLoggedEvent),
);

// Pattern detection

EventBus.on(
  EmotionEvents.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionHandlers.onMoreNegativeThanPositiveEmotionsPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionHandlers.onMultipleMaladaptiveReactionsPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionHandlers.onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionHandlers.onLowCopingEffectivenessPatternDetectedEvent),
);

// Alarms

new Sagas.AlarmProcessing(OpenAI).register(EventBus);
