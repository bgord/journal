import * as bg from "@bgord/bun";
import { SUPPORTED_LANGUAGES } from "+languages";
import * as EmotionCommandHandlers from "+emotions/command-handlers";
import * as EmotionCommands from "+emotions/commands";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { EventStore } from "+infra/event-store";
import { TemporaryFile } from "+infra/temporary-file.adapter";
import * as PreferencesCommandHandlers from "+preferences/command-handlers";
import * as PreferencesCommands from "+preferences/commands";
import * as PublishingCommandHandlers from "+publishing/command-handlers";
import * as PublishingCommands from "+publishing/commands";

CommandBus.on(
  EmotionCommands.CANCEL_ALARM_COMMAND,
  EmotionCommandHandlers.handleCancelAlarmCommand(Adapters.Emotions.AlarmRepository),
);
CommandBus.on(
  EmotionCommands.DELETE_ENTRY_COMMAND,
  EmotionCommandHandlers.handleDeleteEntryCommand(Adapters.Emotions.EntryRepository),
);
CommandBus.on(
  EmotionCommands.EVALUATE_REACTION_COMMAND,
  EmotionCommandHandlers.handleEvaluateReactionCommand(Adapters.Emotions.EntryRepository),
);
CommandBus.on(
  EmotionCommands.GENERATE_ALARM_COMMAND,
  EmotionCommandHandlers.handleGenerateAlarmCommand(Adapters.Emotions.AlarmRepository, Adapters.AI.AiGateway),
);
CommandBus.on(
  EmotionCommands.LOG_ENTRY_COMMAND,
  EmotionCommandHandlers.handleLogEntryCommand(Adapters.Emotions.EntryRepository),
);
CommandBus.on(
  EmotionCommands.REAPPRAISE_EMOTION_COMMAND,
  EmotionCommandHandlers.handleReappraiseEmotionCommand(Adapters.Emotions.EntryRepository),
);
CommandBus.on(
  EmotionCommands.SAVE_ALARM_ADVICE_COMMAND,
  EmotionCommandHandlers.handleSaveAlarmAdviceCommand(Adapters.Emotions.AlarmRepository),
);
CommandBus.on(
  EmotionCommands.REQUEST_ALARM_NOTIFICATION_COMMAND,
  EmotionCommandHandlers.handleRequestAlarmNotificationCommand(Adapters.Emotions.AlarmRepository),
);
CommandBus.on(
  EmotionCommands.COMPLETE_ALARM_COMMAND,
  EmotionCommandHandlers.handleCompleteAlarmCommand(Adapters.Emotions.AlarmRepository),
);
CommandBus.on(
  EmotionCommands.REQUEST_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleRequestWeeklyReviewCommand(
    EventStore,
    Adapters.Emotions.WeeklyReviewRepository,
    Adapters.Emotions.EntriesPerWeekCount,
  ),
);
CommandBus.on(
  EmotionCommands.COMPLETE_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleCompleteWeeklyReviewCommand(Adapters.Emotions.WeeklyReviewRepository),
);
CommandBus.on(
  EmotionCommands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
  EmotionCommandHandlers.handleMarkWeeklyReviewAsFailedCommand(Adapters.Emotions.WeeklyReviewRepository),
);
CommandBus.on(
  EmotionCommands.DETECT_WEEKLY_PATTERNS_COMMAND,
  EmotionCommandHandlers.handleDetectWeeklyPatternsCommand(EventStore, Adapters.Emotions.EntrySnapshot),
);
CommandBus.on(
  EmotionCommands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
  EmotionCommandHandlers.handleExportWeeklyReviewByEmailCommand(
    EventStore,
    Adapters.Emotions.WeeklyReviewSnapshot,
  ),
);
CommandBus.on(
  EmotionCommands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
  EmotionCommandHandlers.handleScheduleTimeCapsuleEntryCommand(EventStore),
);

CommandBus.on(
  PublishingCommands.CREATE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleCreateShareableLinkCommand(
    Adapters.Publishing.ShareableLinkRepository,
    Adapters.Publishing.ShareableLinksQuota,
  ),
);

CommandBus.on(
  PublishingCommands.EXPIRE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleExpireShareableLinkCommand(Adapters.Publishing.ShareableLinkRepository),
);

CommandBus.on(
  PublishingCommands.REVOKE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleRevokeShareableLinkCommand(Adapters.Publishing.ShareableLinkRepository),
);

CommandBus.on(
  bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
  bg.Preferences.CommandHandlers.handleSetUserLanguageCommand(
    EventStore,
    Adapters.Preferences.UserLanguageQueryAdapter,
    new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
  ),
);

CommandBus.on(
  PreferencesCommands.UPDATE_PROFILE_AVATAR_COMMAND,
  PreferencesCommandHandlers.handleUpdateProfileAvatarCommand(
    EventStore,
    Adapters.ImageInfo,
    Adapters.ImageProcessor,
    TemporaryFile,
    Adapters.RemoteFileStorage,
  ),
);

CommandBus.on(
  PreferencesCommands.REMOVE_PROFILE_AVATAR_COMMAND,
  PreferencesCommandHandlers.handleRemoveProfileAvatarCommand(EventStore, Adapters.RemoteFileStorage),
);
