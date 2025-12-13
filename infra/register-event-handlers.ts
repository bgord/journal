import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import * as EmotionsPolicies from "+emotions/policies";
import type { bootstrap } from "+infra/bootstrap";
// import * as EmotionsSagas from "+emotions/sagas";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

export function registerEventHandlers(di: Awaited<ReturnType<typeof bootstrap>>) {
  // Projections
  new Projections.EntryProjector(di.Adapters.System);
  new Projections.AlarmProjector(di.Adapters.System);
  new Projections.PatternDetectionProjector(di.Adapters.System);
  new Projections.WeeklyReviewProjector(di.Adapters.System);
  new Projections.ShareableLinkProjector(di.Adapters.System);
  new Projections.AiUsageCounterProjector(di.Adapters.System);
  new Projections.HistoryProjector({
    ...di.Adapters.System,
    HistoryProjection: di.Adapters.History.HistoryProjection,
  });
  new Projections.ShareableLinkHitProjector(di.Adapters.System);
  new Projections.PreferencesProjector(di.Adapters.System);
  new Projections.ProfileAvatarsProjector(di.Adapters.System);

  // Policies
  new PublishingPolicies.ShareableLinksExpirer({
    ...di.Adapters.System,
    ExpiringShareableLinks: di.Adapters.Publishing.ExpiringShareableLinks,
  });
  new EmotionsPolicies.EntryAlarmDetector(di.Adapters.System);
  new EmotionsPolicies.WeeklyReviewScheduler({
    ...di.Adapters.System,
    UserDirectory: di.Adapters.Auth.UserDirectory,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    UserDirectory: di.Adapters.Auth.UserDirectory,
    GetLatestEntryTimestampForUser: di.Adapters.Emotions.GetLatestEntryTimestampForUser,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    UserDirectory: di.Adapters.Auth.UserDirectory,
    GetLatestEntryTimestampForUser: di.Adapters.Emotions.GetLatestEntryTimestampForUser,
  });
  new EmotionsPolicies.TimeCapsuleEntriesScheduler({
    ...di.Adapters.System,
    TimeCapsuleDueEntries: di.Adapters.Emotions.TimeCapsuleDueEntries,
  });
  new EmotionsPolicies.TimeCapsuleEntryNotifier({
    ...di.Adapters.System,
    UserContact: di.Adapters.Auth.UserContact,
    UserLanguage: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });
  new EmotionsPolicies.EntryHistoryPublisher({
    ...di.Adapters.System,
    HistoryWriter: di.Adapters.History.HistoryWriter,
  });
  new Preferences.Policies.SetDefaultUserLanguage<typeof SUPPORTED_LANGUAGES>(
    SupportedLanguages.en,
    di.Adapters.System,
  );

  // Sagas
  // new EmotionsSagas.AlarmOrchestrator({
  //   EventBus,
  //   EventHandler,
  //   IdProvider: Adapters.IdProvider,
  //   Clock: Adapters.Clock,
  //   CommandBus,
  //   AiGateway: Adapters.AI.AiGateway,
  //   Mailer,
  //   AlarmCancellationLookup: Adapters.Emotions.AlarmCancellationLookup,
  //   EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  //   UserContact: Adapters.Auth.UserContact,
  //   UserLanguage: Adapters.Preferences.UserLanguage,
  //   EMAIL_FROM: Env.EMAIL_FROM,
  // });
  // new EmotionsSagas.WeeklyReviewProcessing({
  //   EventBus,
  //   EventHandler,
  //   IdProvider: Adapters.IdProvider,
  //   Clock: Adapters.Clock,
  //   CommandBus,
  //   AiGateway: Adapters.AI.AiGateway,
  //   Mailer,
  //   EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  //   UserContact: Adapters.Auth.UserContact,
  //   UserLanguage: Adapters.Preferences.UserLanguage,
  //   EMAIL_FROM: Env.EMAIL_FROM,
  // });
  // new EmotionsSagas.WeeklyReviewExportByEmail({
  //   EventBus,
  //   EventHandler,
  //   IdProvider: Adapters.IdProvider,
  //   Clock: Adapters.Clock,
  //   EventStore,
  //   Mailer,
  //   PdfGenerator: Adapters.Emotions.PdfGenerator,
  //   UserContact: Adapters.Auth.UserContact,
  //   WeeklyReviewExport: Adapters.Emotions.WeeklyReviewExport,
  //   UserLanguage: Adapters.Preferences.UserLanguage,
  //   EMAIL_FROM: Env.EMAIL_FROM,
  // });
}
