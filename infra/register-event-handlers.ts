import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import type { BootstrapType } from "+infra/bootstrap";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

export function registerEventHandlers(di: BootstrapType) {
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
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.TimeCapsuleEntriesScheduler({
    ...di.Adapters.System,
    TimeCapsuleDueEntries: di.Adapters.Emotions.TimeCapsuleDueEntries,
  });
  new EmotionsPolicies.TimeCapsuleEntryNotifier({
    ...di.Adapters.System,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
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
  new EmotionsSagas.AlarmOrchestrator({
    ...di.Adapters.System,
    AiGateway: di.Adapters.AI.AiGateway,
    AlarmCancellationLookup: di.Adapters.Emotions.AlarmCancellationLookup,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewProcessing({
    ...di.Adapters.System,
    AiGateway: di.Adapters.AI.AiGateway,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewExportByEmail({
    ...di.Adapters.System,
    PdfGenerator: di.Adapters.Emotions.PdfGenerator,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    WeeklyReviewExportQuery: di.Adapters.Emotions.WeeklyReviewExportQuery,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });
}
