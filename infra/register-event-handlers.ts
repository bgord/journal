import * as bg from "@bgord/bun";
import * as AiEventHandlers from "+ai/event-handlers";
import * as AiEvents from "+ai/events";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import { Mailer } from "+infra/adapters";
import { AiGateway } from "+infra/adapters/ai";
import { PdfGenerator } from "+infra/adapters/emotions";
import { HistoryRepository, HistoryWriter } from "+infra/adapters/history";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import * as Projections from "+infra/projections";
import * as PublishingEventHandlers from "+publishing/event-handlers";
import * as PublishingEvents from "+publishing/events";
import * as PublishingPolicies from "+publishing/policies";

const EventHandler = new bg.EventHandler(logger);

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

// AI
EventBus.on(
  AiEvents.AI_REQUEST_REGISTERED_EVENT,
  EventHandler.handle(AiEventHandlers.onAiRequestRegisteredEvent),
);

// History
EventBus.on(
  bg.History.Events.HISTORY_POPULATED_EVENT,
  EventHandler.handle(bg.History.EventHandlers.onHistoryPopulatedEvent(new HistoryRepository())),
);
EventBus.on(
  bg.History.Events.HISTORY_CLEARED_EVENT,
  EventHandler.handle(bg.History.EventHandlers.onHistoryClearedEvent(new HistoryRepository())),
);

// Emotions
new Projections.EntryProjector(EventBus);
new Projections.AlarmProjector(EventBus);
new Projections.PatternDetectionProjector(EventBus);
new Projections.WeeklyReviewProjector(EventBus);

// Policies
new PublishingPolicies.ShareableLinksExpirer(EventBus);
new EmotionsPolicies.EntryAlarmDetector(EventBus);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus);
new EmotionsPolicies.InactivityAlarmScheduler(EventBus);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(EventBus);
new EmotionsPolicies.EntryHistoryPublisher(EventBus, HistoryWriter);

// Sagas
new EmotionsSagas.AlarmOrchestrator(EventBus, AiGateway, Mailer);
new EmotionsSagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
new EmotionsSagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
