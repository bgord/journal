import * as bg from "@bgord/bun";
import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
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
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
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
new Projections.ShareableLinkHitProjector(EventBus, EventHandler);
new Projections.PreferencesProjector(EventBus, EventHandler);

// Policies
new PublishingPolicies.ShareableLinksExpirer(EventBus, EventHandler, CommandBus, ExpiringShareableLinks);
new EmotionsPolicies.EntryAlarmDetector(EventBus, EventHandler, CommandBus);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus, EventHandler, CommandBus, UserDirectory);
new EmotionsPolicies.InactivityAlarmScheduler(
  EventBus,
  EventHandler,
  CommandBus,
  UserDirectory,
  GetLatestEntryTimestampForUser,
);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(EventBus, EventHandler, CommandBus, TimeCapsuleDueEntries);
new EmotionsPolicies.EntryHistoryPublisher(EventBus, EventHandler, HistoryWriter);
new Preferences.Policies.SetDefaultUserLanguage<typeof SUPPORTED_LANGUAGES>(
  EventBus,
  EventHandler,
  CommandBus,
  SupportedLanguages.en,
);

// Sagas
new EmotionsSagas.AlarmOrchestrator(
  EventBus,
  EventHandler,
  CommandBus,
  AiGateway,
  Mailer,
  AlarmCancellationLookup,
  EntrySnapshot,
  UserContact,
  Env.EMAIL_FROM,
);
new EmotionsSagas.WeeklyReviewProcessing(
  EventBus,
  EventHandler,
  CommandBus,
  AiGateway,
  Mailer,
  EntrySnapshot,
  UserContact,
  Env.EMAIL_FROM,
);
new EmotionsSagas.WeeklyReviewExportByEmail(
  EventBus,
  EventHandler,
  EventStore,
  Mailer,
  PdfGenerator,
  UserContact,
  WeeklyReviewExport,
  Env.EMAIL_FROM,
);
