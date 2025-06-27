import * as bg from "@bgord/bun";
import * as EmotionEventHandlers from "../modules/emotions/event-handlers";
import * as EmotionEvents from "../modules/emotions/events";
import * as Sagas from "../modules/emotions/sagas";
import { EventBus } from "./event-bus";
import { logger } from "./logger";
import { OpenAiClient } from "./open-ai-client";

const EventHandler = new bg.EventHandler(logger);
const OpenAI = new OpenAiClient();

// Emotion journal entry

EventBus.on(
  EmotionEvents.EMOTION_JOURNAL_ENTRY_DELETED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onEmotionJournalEntryDeletedEvent),
);

EventBus.on(
  EmotionEvents.EMOTION_REAPPRAISED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onEmotionReappraisedEvent),
);

EventBus.on(
  EmotionEvents.EMOTION_LOGGED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onEmotionLoggedEvent),
);

EventBus.on(
  EmotionEvents.REACTION_EVALUATED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onReactionEvaluatedEvent),
);

EventBus.on(
  EmotionEvents.REACTION_LOGGED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onReactionLoggedEvent),
);

EventBus.on(
  EmotionEvents.SITUATION_LOGGED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onSituationLoggedEvent),
);

// Pattern detection

EventBus.on(
  EmotionEvents.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onMoreNegativeThanPositiveEmotionsPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onMultipleMaladaptiveReactionsPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent),
);

EventBus.on(
  EmotionEvents.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onLowCopingEffectivenessPatternDetectedEvent),
);

// Alarms

EventBus.on(
  EmotionEvents.ALARM_GENERATED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onAlarmGeneratedEvent),
);

EventBus.on(
  EmotionEvents.ALARM_ADVICE_SAVED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onAlarmAdviceSavedEvent),
);

EventBus.on(
  EmotionEvents.ALARM_NOTIFICATION_SENT_EVENT,
  EventHandler.handle(EmotionEventHandlers.onAlarmNotificationSentEvent),
);

EventBus.on(
  EmotionEvents.ALARM_CANCELLED_EVENT,
  EventHandler.handle(EmotionEventHandlers.onAlarmCancelledEvent),
);

new Sagas.AlarmProcessing(OpenAI).register(EventBus);
