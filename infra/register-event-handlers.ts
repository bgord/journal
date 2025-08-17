import * as bg from "@bgord/bun";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import { Mailer } from "+infra/adapters";
import { AiGateway } from "+infra/adapters/ai";
import { UserContact, UserDirectory } from "+infra/adapters/auth";
import {
  AlarmCancellationLookup,
  EntrySnapshot,
  GetLatestEntryTimestampForUser,
  PdfGenerator,
  TimeCapsuleDueEntries,
  WeeklyReviewExport,
} from "+infra/adapters/emotions";
import { HistoryProjection, HistoryWriter } from "+infra/adapters/history";
import { ExpiringShareableLinks } from "+infra/adapters/publishing";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

const EventHandler = new bg.EventHandler(logger);

// Projections
new Projections.EntryProjector(EventBus, EventHandler);
new Projections.AlarmProjector(EventBus, EventHandler);
new Projections.PatternDetectionProjector(EventBus, EventHandler);
new Projections.WeeklyReviewProjector(EventBus, EventHandler);
new Projections.ShareableLinkProjector(EventBus, EventHandler);
new Projections.AiUsageCounterProjector(EventBus, EventHandler);
new Projections.HistoryProjector(EventBus, EventHandler, HistoryProjection);

// Policies
new PublishingPolicies.ShareableLinksExpirer(EventBus, EventHandler, ExpiringShareableLinks);
new EmotionsPolicies.EntryAlarmDetector(EventBus, EventHandler);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus, EventHandler, UserDirectory);
new EmotionsPolicies.InactivityAlarmScheduler(
  EventBus,
  EventHandler,
  UserDirectory,
  GetLatestEntryTimestampForUser,
);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(EventBus, EventHandler, TimeCapsuleDueEntries);
new EmotionsPolicies.EntryHistoryPublisher(EventBus, EventHandler, HistoryWriter);

// Sagas
new EmotionsSagas.AlarmOrchestrator(
  EventBus,
  EventHandler,
  AiGateway,
  Mailer,
  AlarmCancellationLookup,
  EntrySnapshot,
  UserContact,
);
new EmotionsSagas.WeeklyReviewProcessing(
  EventBus,
  EventHandler,
  AiGateway,
  Mailer,
  EntrySnapshot,
  UserContact,
);
new EmotionsSagas.WeeklyReviewExportByEmail(
  EventBus,
  EventHandler,
  Mailer,
  PdfGenerator,
  UserContact,
  WeeklyReviewExport,
);
