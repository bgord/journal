import * as bg from "@bgord/bun";
import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import * as Adapters from "+infra/adapters";
import { Mailer } from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger.adapter";
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
new Projections.HistoryProjector(EventBus, EventHandler, Adapters.History.HistoryProjection);
new Projections.ShareableLinkHitProjector(EventBus, EventHandler);
new Projections.PreferencesProjector(EventBus, EventHandler);

// Policies
new PublishingPolicies.ShareableLinksExpirer(
  EventBus,
  EventHandler,
  CommandBus,
  Adapters.Publishing.ExpiringShareableLinks,
);
new EmotionsPolicies.EntryAlarmDetector(EventBus, EventHandler, CommandBus);
new EmotionsPolicies.WeeklyReviewScheduler(EventBus, EventHandler, CommandBus, Adapters.Auth.UserDirectory);
new EmotionsPolicies.InactivityAlarmScheduler(
  EventBus,
  EventHandler,
  CommandBus,
  Adapters.Auth.UserDirectory,
  Adapters.Emotions.GetLatestEntryTimestampForUser,
);
new EmotionsPolicies.TimeCapsuleEntriesScheduler(
  EventBus,
  EventHandler,
  CommandBus,
  Adapters.Emotions.TimeCapsuleDueEntries,
);
new EmotionsPolicies.EntryHistoryPublisher(EventBus, EventHandler, Adapters.History.HistoryWriter);
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
  Adapters.AI.AiGateway,
  Mailer,
  Adapters.Emotions.AlarmCancellationLookup,
  Adapters.Emotions.EntrySnapshot,
  Adapters.Auth.UserContact,
  Adapters.Preferences.UserLanguage,
  Env.EMAIL_FROM,
);
new EmotionsSagas.WeeklyReviewProcessing(
  EventBus,
  EventHandler,
  CommandBus,
  Adapters.AI.AiGateway,
  Mailer,
  Adapters.Emotions.EntrySnapshot,
  Adapters.Auth.UserContact,
  Adapters.Preferences.UserLanguage,
  Env.EMAIL_FROM,
);
new EmotionsSagas.WeeklyReviewExportByEmail(
  EventBus,
  EventHandler,
  EventStore,
  Mailer,
  Adapters.Emotions.PdfGenerator,
  Adapters.Auth.UserContact,
  Adapters.Emotions.WeeklyReviewExport,
  Adapters.Preferences.UserLanguage,
  Env.EMAIL_FROM,
);
