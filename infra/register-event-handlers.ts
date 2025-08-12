import * as AI from "+ai";
import * as EmotionsEventHandlers from "+emotions/event-handlers";
import * as EmotionsEvents from "+emotions/events";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import { AiClient } from "+infra/ai-client";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import { Mailer } from "+infra/mailer";
import { PdfGenerator } from "+infra/pdf-generator";
import * as PublishingEventHandlers from "+publishing/event-handlers";
import * as PublishingEvents from "+publishing/events";
import * as PublishingPolicies from "+publishing/policies";
import * as bg from "@bgord/bun";

const EventHandler = new bg.EventHandler(logger);

// Entry
EventBus.on(
  EmotionsEvents.ENTRY_DELETED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onEntryDeletedEvent),
);
EventBus.on(
  EmotionsEvents.EMOTION_REAPPRAISED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onEmotionReappraisedEvent),
);
EventBus.on(
  EmotionsEvents.EMOTION_LOGGED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onEmotionLoggedEvent),
);
EventBus.on(
  EmotionsEvents.REACTION_EVALUATED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onReactionEvaluatedEvent),
);
EventBus.on(
  EmotionsEvents.REACTION_LOGGED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onReactionLoggedEvent),
);
EventBus.on(
  EmotionsEvents.SITUATION_LOGGED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onSituationLoggedEvent),
);

// Pattern detection
EventBus.on(
  EmotionsEvents.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  EmotionsEvents.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  EmotionsEvents.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onPatternDetectedEvent),
);
EventBus.on(
  EmotionsEvents.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onPatternDetectedEvent),
);

// Alarm
EventBus.on(
  EmotionsEvents.ALARM_GENERATED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onAlarmGeneratedEvent),
);
EventBus.on(
  EmotionsEvents.ALARM_ADVICE_SAVED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onAlarmAdviceSavedEvent),
);
EventBus.on(
  EmotionsEvents.ALARM_NOTIFICATION_SENT_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onAlarmNotificationSentEvent),
);
EventBus.on(
  EmotionsEvents.ALARM_CANCELLED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onAlarmCancelledEvent),
);

// Weekly review
EventBus.on(
  EmotionsEvents.WEEKLY_REVIEW_COMPLETED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onWeeklyReviewCompletedEvent),
);
EventBus.on(
  EmotionsEvents.WEEKLY_REVIEW_FAILED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onWeeklyReviewFailedEvent),
);
EventBus.on(
  EmotionsEvents.WEEKLY_REVIEW_REQUESTED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onWeeklyReviewRequestedEvent),
);
EventBus.on(
  EmotionsEvents.WEEKLY_REVIEW_SKIPPED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onWeeklyReviewSkippedEvent),
);
EventBus.on(
  EmotionsEvents.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
  EventHandler.handle(EmotionsEventHandlers.onTimeCapsuleEntryScheduledEvent),
);

// Shareable links
EventBus.on(
  PublishingEvents.SHAREABLE_LINK_CREATED,
  EventHandler.handle(PublishingEventHandlers.onShareableLinkCreatedEvent),
);
EventBus.on(
  PublishingEvents.SHAREABLE_LINK_EXPIRED,
  EventHandler.handle(PublishingEventHandlers.onShareableLinkExpiredEvent),
);
EventBus.on(
  PublishingEvents.SHAREABLE_LINK_REVOKED,
  EventHandler.handle(PublishingEventHandlers.onShareableLinkRevokedEvent),
);

// Policies
new PublishingPolicies.ShareableLinksExpirer(EventBus);
new EmotionsPolicies.EntryAlarmDetector(EventBus);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus);
new EmotionsPolicies.InactivityAlarmScheduler(EventBus);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(EventBus);

// Sagas
new EmotionsSagas.AlarmOrchestrator(EventBus, AiClient, Mailer);
new EmotionsSagas.WeeklyReviewProcessing(EventBus, AI.AiGateway, Mailer);
new EmotionsSagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
