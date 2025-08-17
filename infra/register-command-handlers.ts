import * as EmotionCommandHandlers from "+emotions/command-handlers";
import * as EmotionCommands from "+emotions/commands";
import { WeeklyReviewSnapshot } from "+infra/adapters/emotions";
import { CommandBus } from "+infra/command-bus";
import * as PublishingCommandHandlers from "+publishing/command-handlers";
import * as PublishingCommands from "+publishing/commands";

CommandBus.on(EmotionCommands.CANCEL_ALARM_COMMAND, EmotionCommandHandlers.handleCancelAlarmCommand);
CommandBus.on(EmotionCommands.DELETE_ENTRY_COMMAND, EmotionCommandHandlers.handleDeleteEntryCommand);
CommandBus.on(
  EmotionCommands.EVALUATE_REACTION_COMMAND,
  EmotionCommandHandlers.handleEvaluateReactionCommand,
);
CommandBus.on(EmotionCommands.GENERATE_ALARM_COMMAND, EmotionCommandHandlers.handleGenerateAlarmCommand);
CommandBus.on(EmotionCommands.LOG_ENTRY_COMMAND, EmotionCommandHandlers.handleLogEntryCommand);
CommandBus.on(
  EmotionCommands.REAPPRAISE_EMOTION_COMMAND,
  EmotionCommandHandlers.handleReappraiseEmotionCommand,
);
CommandBus.on(EmotionCommands.SAVE_ALARM_ADVICE_COMMAND, EmotionCommandHandlers.handleSaveAlarmAdviceCommand);
CommandBus.on(
  EmotionCommands.REQUEST_ALARM_NOTIFICATION_COMMAND,
  EmotionCommandHandlers.handleRequestAlarmNotificationCommand,
);
CommandBus.on(EmotionCommands.COMPLETE_ALARM_COMMAND, EmotionCommandHandlers.handleCompleteAlarmCommand);
CommandBus.on(
  EmotionCommands.REQUEST_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleRequestWeeklyReviewCommand,
);
CommandBus.on(
  EmotionCommands.COMPLETE_WEEKLY_REVIEW_COMMAND,
  EmotionCommandHandlers.handleCompleteWeeklyReviewCommand,
);
CommandBus.on(
  EmotionCommands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
  EmotionCommandHandlers.handleMarkWeeklyReviewAsFailedCommand,
);
CommandBus.on(
  EmotionCommands.DETECT_WEEKLY_PATTERNS_COMMAND,
  EmotionCommandHandlers.handleDetectWeeklyPatternsCommand,
);
CommandBus.on(
  EmotionCommands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
  EmotionCommandHandlers.handleExportWeeklyReviewByEmailCommand(WeeklyReviewSnapshot),
);
CommandBus.on(
  EmotionCommands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
  EmotionCommandHandlers.handleScheduleTimeCapsuleEntryCommand,
);

CommandBus.on(
  PublishingCommands.CREATE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleCreateShareableLinkCommand,
);

CommandBus.on(
  PublishingCommands.EXPIRE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleExpireShareableLinkCommand,
);

CommandBus.on(
  PublishingCommands.REVOKE_SHAREABLE_LINK_COMMAND,
  PublishingCommandHandlers.handleRevokeShareableLinkCommand,
);
