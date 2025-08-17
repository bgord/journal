import * as bg from "@bgord/bun";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import { Mailer } from "+infra/adapters";
import { AiGateway } from "+infra/adapters/ai";
import { AlarmCancellationLookup, PdfGenerator } from "+infra/adapters/emotions";
import { HistoryRepository, HistoryWriter } from "+infra/adapters/history";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

const EventHandler = new bg.EventHandler(logger);
const historyRepository = new HistoryRepository();

// Projections
new Projections.EntryProjector(EventBus, EventHandler);
new Projections.AlarmProjector(EventBus, EventHandler);
new Projections.PatternDetectionProjector(EventBus, EventHandler);
new Projections.WeeklyReviewProjector(EventBus, EventHandler);
new Projections.ShareableLinkProjector(EventBus, EventHandler);
new Projections.AiUsageCounterProjector(EventBus, EventHandler);
new Projections.HistoryProjector(EventBus, EventHandler, historyRepository);

// Policies
new PublishingPolicies.ShareableLinksExpirer(EventBus);
new EmotionsPolicies.EntryAlarmDetector(EventBus);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus);
new EmotionsPolicies.InactivityAlarmScheduler(EventBus);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(EventBus);
new EmotionsPolicies.EntryHistoryPublisher(EventBus, HistoryWriter);

// Sagas
new EmotionsSagas.AlarmOrchestrator(EventBus, AiGateway, Mailer, AlarmCancellationLookup);
new EmotionsSagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
new EmotionsSagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
