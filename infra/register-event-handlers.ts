import * as EventHandlers from "+emotions/event-handlers";
import * as Events from "+emotions/events";
import * as Sagas from "+emotions/sagas";
import { AiClient } from "+infra/ai-client";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";

const EventHandler = new bg.EventHandler(logger);

// Entry
EventBus.on(Events.ENTRY_DELETED_EVENT, EventHandler.handle(EventHandlers.onEntryDeletedEvent));
EventBus.on(Events.EMOTION_REAPPRAISED_EVENT, EventHandler.handle(EventHandlers.onEmotionReappraisedEvent));
EventBus.on(Events.EMOTION_LOGGED_EVENT, EventHandler.handle(EventHandlers.onEmotionLoggedEvent));
EventBus.on(Events.REACTION_EVALUATED_EVENT, EventHandler.handle(EventHandlers.onReactionEvaluatedEvent));
EventBus.on(Events.REACTION_LOGGED_EVENT, EventHandler.handle(EventHandlers.onReactionLoggedEvent));
EventBus.on(Events.SITUATION_LOGGED_EVENT, EventHandler.handle(EventHandlers.onSituationLoggedEvent));

// Pattern detection
EventBus.on(
  Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EventHandlers.onPatternDetectedEvent),
);

// Alarm
EventBus.on(Events.ALARM_GENERATED_EVENT, EventHandler.handle(EventHandlers.onAlarmGeneratedEvent));
EventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, EventHandler.handle(EventHandlers.onAlarmAdviceSavedEvent));
EventBus.on(
  Events.ALARM_NOTIFICATION_SENT_EVENT,
  EventHandler.handle(EventHandlers.onAlarmNotificationSentEvent),
);
EventBus.on(Events.ALARM_CANCELLED_EVENT, EventHandler.handle(EventHandlers.onAlarmCancelledEvent));

// Weekly review
EventBus.on(
  Events.WEEKLY_REVIEW_COMPLETED_EVENT,
  EventHandler.handle(EventHandlers.onWeeklyReviewCompletedEvent),
);
EventBus.on(Events.WEEKLY_REVIEW_FAILED_EVENT, EventHandler.handle(EventHandlers.onWeeklyReviewFailedEvent));
EventBus.on(
  Events.WEEKLY_REVIEW_REQUESTED_EVENT,
  EventHandler.handle(EventHandlers.onWeeklyReviewRequestedEvent),
);
EventBus.on(
  Events.WEEKLY_REVIEW_SKIPPED_EVENT,
  EventHandler.handle(EventHandlers.onWeeklyReviewSkippedEvent),
);

// Sagas
new Sagas.EntryAlarmDetector(EventBus).register();
new Sagas.AlarmOrchestrator(EventBus, AiClient).register();
new Sagas.WeeklyReviewProcessing(EventBus, AiClient).register();
