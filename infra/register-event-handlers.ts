import { type SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import * as EmotionsPolicies from "+emotions/policies";
import * as EmotionsSagas from "+emotions/sagas";
import type { BootstrapType } from "+infra/bootstrap";
import * as Projections from "+infra/projections";
import * as PublishingPolicies from "+publishing/policies";

export function registerEventHandlers({ Adapters, Env, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  // Projections
  new Projections.EntryProjector(deps);
  new Projections.AlarmProjector(deps);
  new Projections.PatternDetectionProjector(deps);
  new Projections.WeeklyReviewProjector(deps);
  new Projections.ShareableLinkProjector(deps);
  new Projections.AiUsageCounterProjector(deps);
  new Projections.HistoryProjector({ ...deps, ...Adapters.History });
  new Projections.ShareableLinkHitProjector(deps);
  new Projections.PreferencesProjector(deps);
  new Projections.ProfileAvatarsProjector(deps);

  // Policies
  new PublishingPolicies.ShareableLinksExpirer({ ...deps, ...Adapters.Publishing });
  new EmotionsPolicies.EntryAlarmDetector(deps);
  new EmotionsPolicies.WeeklyReviewScheduler({ ...deps, ...Adapters.Auth });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...deps,
    UserDirectoryOHQ: Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.InactivityAlarmScheduler({
    ...deps,
    UserDirectoryOHQ: Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });
  new EmotionsPolicies.TimeCapsuleEntriesScheduler({ ...deps, ...Adapters.Emotions });
  new EmotionsPolicies.TimeCapsuleEntryNotifier({
    ...deps,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsPolicies.EntryHistoryPublisher({ ...deps, ...Adapters.History });
  new Preferences.Policies.SetDefaultUserLanguage<typeof SUPPORTED_LANGUAGES>(SupportedLanguages.en, deps);

  // Sagas
  new EmotionsSagas.AlarmOrchestrator({
    ...deps,
    AiGateway: Adapters.AI.AiGateway,
    AlarmCancellationLookup: Adapters.Emotions.AlarmCancellationLookup,
    EntrySnapshot: Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewProcessing({
    ...deps,
    AiGateway: Adapters.AI.AiGateway,
    EntrySnapshot: Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
  new EmotionsSagas.WeeklyReviewExportByEmail({
    ...deps,
    PdfGenerator: Adapters.Emotions.PdfGenerator,
    UserContactOHQ: Adapters.Auth.UserContactOHQ,
    WeeklyReviewExportQuery: Adapters.Emotions.WeeklyReviewExportQuery,
    UserLanguageOHQ: Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: Env.EMAIL_FROM,
  });
}
