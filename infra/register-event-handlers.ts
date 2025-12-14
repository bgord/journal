import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import type { BootstrapType } from "+infra/bootstrap";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

export function registerEventHandlers({ Adapters, Env }: BootstrapType) {
  // Projections
  new Projections.EntryProjector(Adapters.System);
  new Projections.AlarmProjector(Adapters.System);
  new Projections.PatternDetectionProjector(Adapters.System);
  new Projections.WeeklyReviewProjector(Adapters.System);
  new Projections.ShareableLinkProjector(Adapters.System);
  new Projections.AiUsageCounterProjector(Adapters.System);
  new Projections.HistoryProjector({ ...Adapters.System, ...Adapters.History });
  new Projections.ShareableLinkHitProjector(Adapters.System);
  new Projections.PreferencesProjector(Adapters.System);
  new Projections.ProfileAvatarsProjector(Adapters.System);

  // Policies
  new PublishingPolicies.ShareableLinksExpirer({ ...Adapters.System, ...Adapters.Publishing });
  new EmotionsPolicies.EntryAlarmDetector(Adapters.System);
  new EmotionsPolicies.WeeklyReviewScheduler({ ...Adapters.System, ...Adapters.Auth });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...Adapters.System,
    UserDirectoryOHQ: Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...Adapters.System,
    UserDirectoryOHQ: Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.TimeCapsuleEntriesScheduler({ ...Adapters.System, ...Adapters.Emotions });
  new EmotionsPolicies.TimeCapsuleEntryNotifier({
    ...Adapters.System,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsPolicies.EntryHistoryPublisher({ ...Adapters.System, ...Adapters.History });
  new Preferences.Policies.SetDefaultUserLanguage<typeof SUPPORTED_LANGUAGES>(
    SupportedLanguages.en,
    Adapters.System,
  );

  // Sagas
  new EmotionsSagas.AlarmOrchestrator({
    ...Adapters.System,
    AiGateway: Adapters.AI.AiGateway,
    AlarmCancellationLookup: Adapters.Emotions.AlarmCancellationLookup,
    EntrySnapshot: Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewProcessing({
    ...Adapters.System,
    AiGateway: Adapters.AI.AiGateway,
    EntrySnapshot: Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewExportByEmail({
    ...Adapters.System,
    PdfGenerator: Adapters.Emotions.PdfGenerator,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    WeeklyReviewExportQuery: Adapters.Emotions.WeeklyReviewExportQuery,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
}
