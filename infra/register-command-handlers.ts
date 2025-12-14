import * as bg from "@bgord/bun";
import { SUPPORTED_LANGUAGES } from "+languages";
import * as EmotionCommandHandlers from "+emotions/command-handlers";
import * as EmotionCommands from "+emotions/commands";
import type { BootstrapType } from "+infra/bootstrap";
import * as PreferencesCommandHandlers from "+preferences/command-handlers";
import * as PreferencesCommands from "+preferences/commands";
import * as PublishingCommandHandlers from "+publishing/command-handlers";
import * as PublishingCommands from "+publishing/commands";

export function registerCommandHandlers(di: BootstrapType) {
  di.Adapters.System.CommandBus.on(
    EmotionCommands.CANCEL_ALARM_COMMAND,
    EmotionCommandHandlers.handleCancelAlarmCommand(di.Adapters.Emotions.AlarmRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.DELETE_ENTRY_COMMAND,
    EmotionCommandHandlers.handleDeleteEntryCommand(di.Adapters.Emotions.EntryRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.EVALUATE_REACTION_COMMAND,
    EmotionCommandHandlers.handleEvaluateReactionCommand(di.Adapters.Emotions.EntryRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.GENERATE_ALARM_COMMAND,
    EmotionCommandHandlers.handleGenerateAlarmCommand({
      ...di.Adapters.System,
      repo: di.Adapters.Emotions.AlarmRepository,
      AiGateway: di.Adapters.AI.AiGateway,
    }),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.LOG_ENTRY_COMMAND,
    EmotionCommandHandlers.handleLogEntryCommand({
      ...di.Adapters.System,
      repo: di.Adapters.Emotions.EntryRepository,
    }),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.REAPPRAISE_EMOTION_COMMAND,
    EmotionCommandHandlers.handleReappraiseEmotionCommand(di.Adapters.Emotions.EntryRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.SAVE_ALARM_ADVICE_COMMAND,
    EmotionCommandHandlers.handleSaveAlarmAdviceCommand(di.Adapters.Emotions.AlarmRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.REQUEST_ALARM_NOTIFICATION_COMMAND,
    EmotionCommandHandlers.handleRequestAlarmNotificationCommand(di.Adapters.Emotions.AlarmRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.COMPLETE_ALARM_COMMAND,
    EmotionCommandHandlers.handleCompleteAlarmCommand(di.Adapters.Emotions.AlarmRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.REQUEST_WEEKLY_REVIEW_COMMAND,
    EmotionCommandHandlers.handleRequestWeeklyReviewCommand({
      ...di.Adapters.System,
      repo: di.Adapters.Emotions.WeeklyReviewRepository,
      EntriesPerWeekCountQuery: di.Adapters.Emotions.EntriesPerWeekCountQuery,
    }),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.COMPLETE_WEEKLY_REVIEW_COMMAND,
    EmotionCommandHandlers.handleCompleteWeeklyReviewCommand(di.Adapters.Emotions.WeeklyReviewRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
    EmotionCommandHandlers.handleMarkWeeklyReviewAsFailedCommand(di.Adapters.Emotions.WeeklyReviewRepository),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.DETECT_WEEKLY_PATTERNS_COMMAND,
    EmotionCommandHandlers.handleDetectWeeklyPatternsCommand({
      ...di.Adapters.System,
      EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    }),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
    EmotionCommandHandlers.handleExportWeeklyReviewByEmailCommand({
      ...di.Adapters.System,
      WeeklyReviewSnapshot: di.Adapters.Emotions.WeeklyReviewSnapshot,
    }),
  );
  di.Adapters.System.CommandBus.on(
    EmotionCommands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
    EmotionCommandHandlers.handleScheduleTimeCapsuleEntryCommand(di.Adapters.System),
  );

  di.Adapters.System.CommandBus.on(
    PublishingCommands.CREATE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleCreateShareableLinkCommand({
      ...di.Adapters.System,
      repo: di.Adapters.Publishing.ShareableLinkRepository,
      ShareableLinksQuotaQuery: di.Adapters.Publishing.ShareableLinksQuotaQuery,
    }),
  );

  di.Adapters.System.CommandBus.on(
    PublishingCommands.EXPIRE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleExpireShareableLinkCommand(
      di.Adapters.Publishing.ShareableLinkRepository,
    ),
  );

  di.Adapters.System.CommandBus.on(
    PublishingCommands.REVOKE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleRevokeShareableLinkCommand(
      di.Adapters.Publishing.ShareableLinkRepository,
    ),
  );

  di.Adapters.System.CommandBus.on(
    bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    // TODO
    bg.Preferences.CommandHandlers.handleSetUserLanguageCommand(
      di.Adapters.System.EventStore,
      di.Adapters.System.IdProvider,
      di.Adapters.System.Clock,
      di.Adapters.Preferences.UserLanguageQuery,
      new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
    ),
  );

  di.Adapters.System.CommandBus.on(
    PreferencesCommands.UPDATE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleUpdateProfileAvatarCommand(di.Adapters.System),
  );

  di.Adapters.System.CommandBus.on(
    PreferencesCommands.REMOVE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleRemoveProfileAvatarCommand(di.Adapters.System),
  );
}
