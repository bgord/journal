import * as EmotionCommandHandlers from "+emotions/command-handlers";
import * as EmotionCommands from "+emotions/commands";
import { AiGateway } from "+infra/adapters/ai";
import {
  AlarmRepository,
  EntriesPerWeekCount,
  EntryRepository,
  EntrySnapshot,
  WeeklyReviewRepository,
  WeeklyReviewSnapshot,
} from "+infra/adapters/emotions";
import { UserLanguageQueryAdapter } from "+infra/adapters/preferences";
import { ShareableLinkRepositoryAdapter, ShareableLinksQuota } from "+infra/adapters/publishing";
import { CommandBus } from "+infra/command-bus";
import { EventStore } from "+infra/event-store";
import * as PreferencesCommandHandler from "+preferences/command-handlers";
import * as PreferencesCommand from "+preferences/commands";
import * as PublishingCommandHandlers from "+publishing/command-handlers";
import * as PublishingCommands from "+publishing/commands";

CommandBus.on(
  EmotionCommands.CANCEL_ALARM_COMMAND,
  EmotionCommandHandlers.handleCancelAlarmCommand(AlarmRepository),
);
CommandBus.on(
  EmotionCommands.DELETE_ENTRY_COMMAND,
  EmotionCommandHandlers.handleDeleteEntryCommand(EntryRepository),
);
CommandBus.on(
  EmotionCommands.EVALUATE_REACTION_COMMAND,
  EmotionCommandHandlers.handleEvaluateReactionCommand(EntryRepository),
);
CommandBus.on(
  EmotionCommands.GENERATE_ALARM_COMMAND,
  EmotionCommandHandlers.handleGenerateAlarmCommand(AlarmRepository, AiGateway),
);
CommandBus.on(
  EmotionCommands.LOG_ENTRY_COMMAND,
  EmotionCommandHandlers.handleLogEntryCommand(EntryRepository),
);
CommandBus.on(
  EmotionCommands.REAPPRAISE_EMOTION_COMMAND,
  EmotionCommandHandlers.handleReappraiseEmotionCommand(EntryRepository),
);
CommandBus.on(
  EmotionCommands.SAVE_ALARM_ADVICE_COMMAND,
  EmotionCommandHandlers.handleSaveAlarmAdviceCommand(AlarmRepository),
);
CommandBus.on(
  EmotionCommands.REQUEST_ALARM_NOTIFICATION_COMMAND,
  EmotionCommandHandlers.handleRequestAlarmNotificationCommand(AlarmRepository),
);
CommandBus.on(
  EmotionCommands.COMPLETE_ALARM_COMMAND,
  EmotionCommandHandlers.handleCompleteAlarmCommand(AlarmRepository),
);
CommandBus.on(
  EmotionCommands.REQUEST_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleRequestWeeklyReviewCommand(
    EventStore,
    WeeklyReviewRepository,
    EntriesPerWeekCount,
  ),
);
CommandBus.on(
  EmotionCommands.COMPLETE_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleCompleteWeeklyReviewCommand(WeeklyReviewRepository),
);
CommandBus.on(
  EmotionCommands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
  EmotionCommandHandlers.handleMarkWeeklyReviewAsFailedCommand(WeeklyReviewRepository),
);
CommandBus.on(
  EmotionCommands.DETECT_WEEKLY_PATTERNS_COMMAND,
  EmotionCommandHandlers.handleDetectWeeklyPatternsCommand(EventStore, EntrySnapshot),
);
CommandBus.on(
  EmotionCommands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
  EmotionCommandHandlers.handleExportWeeklyReviewByEmailCommand(EventStore, WeeklyReviewSnapshot),
);
CommandBus.on(
  EmotionCommands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
  EmotionCommandHandlers.handleScheduleTimeCapsuleEntryCommand(EventStore),
);

CommandBus.on(
  PublishingCommands.CREATE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleCreateShareableLinkCommand(
    ShareableLinkRepositoryAdapter,
    ShareableLinksQuota,
  ),
);

CommandBus.on(
  PublishingCommands.EXPIRE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleExpireShareableLinkCommand(ShareableLinkRepositoryAdapter),
);

CommandBus.on(
  PublishingCommands.REVOKE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleRevokeShareableLinkCommand(ShareableLinkRepositoryAdapter),
);

CommandBus.on(
  PreferencesCommand.SET_USER_LANGUAGE_COMMAND,
  PreferencesCommandHandler.handleSetUserLanguageCommand(EventStore, UserLanguageQueryAdapter),
);
