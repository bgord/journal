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
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

const EventHandler = new bg.EventHandler(Adapters.Logger);

// Projections
new Projections.EntryProjector(EventBus, EventHandler);
new Projections.AlarmProjector(EventBus, EventHandler);
new Projections.PatternDetectionProjector(EventBus, EventHandler);
new Projections.WeeklyReviewProjector(EventBus, EventHandler);
new Projections.ShareableLinkProjector(EventBus, EventHandler);
new Projections.AiUsageCounterProjector(EventBus, EventHandler);
new Projections.HistoryProjector({
  EventBus,
  EventHandler,
  HistoryProjection: Adapters.History.HistoryProjection,
});
new Projections.ShareableLinkHitProjector({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
});
new Projections.PreferencesProjector(EventBus, EventHandler);
new Projections.ProfileAvatarsProjector(EventBus, EventHandler);

// Policies
new PublishingPolicies.ShareableLinksExpirer({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  ExpiringShareableLinks: Adapters.Publishing.ExpiringShareableLinks,
});
new EmotionsPolicies.EntryAlarmDetector({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
});
new EmotionsPolicies.WeeklyReviewScheduler({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  UserDirectory: Adapters.Auth.UserDirectory,
});
new EmotionsPolicies.InactivityAlarmScheduler({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  UserDirectory: Adapters.Auth.UserDirectory,
  GetLatestEntryTimestampForUser: Adapters.Emotions.GetLatestEntryTimestampForUser,
});
new EmotionsPolicies.TimeCapsuleEntriesScheduler({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  TimeCapsuleDueEntries: Adapters.Emotions.TimeCapsuleDueEntries,
});
new EmotionsPolicies.EntryHistoryPublisher({
  EventBus,
  EventHandler,
  HistoryWriter: Adapters.History.HistoryWriter,
  Clock: Adapters.Clock,
});
new Preferences.Policies.SetDefaultUserLanguage<typeof SUPPORTED_LANGUAGES>(
  EventBus,
  EventHandler,
  Adapters.IdProvider,
  Adapters.Clock,
  CommandBus,
  SupportedLanguages.en,
);

// Sagas
new EmotionsSagas.AlarmOrchestrator({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  AiGateway: Adapters.AI.AiGateway,
  Mailer,
  AlarmCancellationLookup: Adapters.Emotions.AlarmCancellationLookup,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  UserContact: Adapters.Auth.UserContact,
  UserLanguage: Adapters.Preferences.UserLanguage,
  EMAIL_FROM: Env.EMAIL_FROM,
});
new EmotionsSagas.WeeklyReviewProcessing({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  CommandBus,
  AiGateway: Adapters.AI.AiGateway,
  Mailer,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  UserContact: Adapters.Auth.UserContact,
  UserLanguage: Adapters.Preferences.UserLanguage,
  EMAIL_FROM: Env.EMAIL_FROM,
});
new EmotionsSagas.WeeklyReviewExportByEmail({
  EventBus,
  EventHandler,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  EventStore,
  Mailer,
  PdfGenerator: Adapters.Emotions.PdfGenerator,
  UserContact: Adapters.Auth.UserContact,
  WeeklyReviewExport: Adapters.Emotions.WeeklyReviewExport,
  UserLanguage: Adapters.Preferences.UserLanguage,
  EMAIL_FROM: Env.EMAIL_FROM,
});
