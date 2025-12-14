import * as bg from "@bgord/bun";
import { SUPPORTED_LANGUAGES } from "+languages";
import * as EmotionCommandHandlers from "+emotions/command-handlers";
import * as EmotionCommands from "+emotions/commands";
import type { BootstrapType } from "+infra/bootstrap";
import * as PreferencesCommandHandlers from "+preferences/command-handlers";
import * as PreferencesCommands from "+preferences/commands";
import * as PublishingCommandHandlers from "+publishing/command-handlers";
import * as PublishingCommands from "+publishing/commands";

export function registerCommandHandlers({ Adapters }: BootstrapType) {
  Adapters.System.CommandBus.on(
    EmotionCommands.CANCEL_ALARM_COMMAND,
    EmotionCommandHandlers.handleCancelAlarmCommand(Adapters.Emotions.AlarmRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.DELETE_ENTRY_COMMAND,
    EmotionCommandHandlers.handleDeleteEntryCommand(Adapters.Emotions.EntryRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.EVALUATE_REACTION_COMMAND,
    EmotionCommandHandlers.handleEvaluateReactionCommand(Adapters.Emotions.EntryRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.GENERATE_ALARM_COMMAND,
    EmotionCommandHandlers.handleGenerateAlarmCommand({
      ...Adapters.System,
      repo: Adapters.Emotions.AlarmRepository,
      AiGateway: Adapters.AI.AiGateway,
    }),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.LOG_ENTRY_COMMAND,
    EmotionCommandHandlers.handleLogEntryCommand({
      ...Adapters.System,
      repo: Adapters.Emotions.EntryRepository,
    }),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.REAPPRAISE_EMOTION_COMMAND,
    EmotionCommandHandlers.handleReappraiseEmotionCommand(Adapters.Emotions.EntryRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.SAVE_ALARM_ADVICE_COMMAND,
    EmotionCommandHandlers.handleSaveAlarmAdviceCommand(Adapters.Emotions.AlarmRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.REQUEST_ALARM_NOTIFICATION_COMMAND,
    EmotionCommandHandlers.handleRequestAlarmNotificationCommand(Adapters.Emotions.AlarmRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.COMPLETE_ALARM_COMMAND,
    EmotionCommandHandlers.handleCompleteAlarmCommand(Adapters.Emotions.AlarmRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.REQUEST_WEEKLY_REVIEW_COMMAND,
    EmotionCommandHandlers.handleRequestWeeklyReviewCommand({
      ...Adapters.System,
      repo: Adapters.Emotions.WeeklyReviewRepository,
      EntriesPerWeekCountQuery: Adapters.Emotions.EntriesPerWeekCountQuery,
    }),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.COMPLETE_WEEKLY_REVIEW_COMMAND,
    EmotionCommandHandlers.handleCompleteWeeklyReviewCommand(Adapters.Emotions.WeeklyReviewRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
    EmotionCommandHandlers.handleMarkWeeklyReviewAsFailedCommand(Adapters.Emotions.WeeklyReviewRepository),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.DETECT_WEEKLY_PATTERNS_COMMAND,
    EmotionCommandHandlers.handleDetectWeeklyPatternsCommand({ ...Adapters.System, ...Adapters.Emotions }),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
    EmotionCommandHandlers.handleExportWeeklyReviewByEmailCommand({
      ...Adapters.System,
      ...Adapters.Emotions,
    }),
  );
  Adapters.System.CommandBus.on(
    EmotionCommands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
    EmotionCommandHandlers.handleScheduleTimeCapsuleEntryCommand(Adapters.System),
  );

  Adapters.System.CommandBus.on(
    PublishingCommands.CREATE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleCreateShareableLinkCommand({
      ...Adapters.System,
      repo: Adapters.Publishing.ShareableLinkRepository,
      ShareableLinksQuotaQuery: Adapters.Publishing.ShareableLinksQuotaQuery,
    }),
  );

  Adapters.System.CommandBus.on(
    PublishingCommands.EXPIRE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleExpireShareableLinkCommand(Adapters.Publishing.ShareableLinkRepository),
  );

  Adapters.System.CommandBus.on(
    PublishingCommands.REVOKE_SHAREABLE_LINK_COMMAND,
    PublishingCommandHandlers.handleRevokeShareableLinkCommand(Adapters.Publishing.ShareableLinkRepository),
  );

  Adapters.System.CommandBus.on(
    bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    bg.Preferences.CommandHandlers.handleSetUserLanguageCommand(
      new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
      { ...Adapters.System, UserLanguageQuery: Adapters.Preferences.UserLanguageQuery },
    ),
  );

  Adapters.System.CommandBus.on(
    PreferencesCommands.UPDATE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleUpdateProfileAvatarCommand(Adapters.System),
  );

  Adapters.System.CommandBus.on(
    PreferencesCommands.REMOVE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleRemoveProfileAvatarCommand(Adapters.System),
  );
}
