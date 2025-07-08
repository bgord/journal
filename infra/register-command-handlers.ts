import * as CommandHandlers from "+emotions/command-handlers";
import * as Commands from "+emotions/commands";
import { CommandBus } from "+infra/command-bus";

CommandBus.on(Commands.CANCEL_ALARM_COMMAND, CommandHandlers.handleCancelAlarmCommand);
CommandBus.on(
  Commands.DELETE_EMOTION_JOURNAL_ENTRY_COMMAND,
  CommandHandlers.handleDeleteEmotionJournalEntryCommand,
);
CommandBus.on(Commands.EVALUATE_REACTION_COMMAND, CommandHandlers.handleEvaluateReactionCommand);
CommandBus.on(Commands.GENERATE_ALARM_COMMAND, CommandHandlers.handleGenerateAlarmCommand);
CommandBus.on(Commands.LOG_ENTRY_COMMAND, CommandHandlers.handleLogEntryCommand);
CommandBus.on(Commands.REAPPRAISE_EMOTION_COMMAND, CommandHandlers.handleReappraiseEmotionCommand);
CommandBus.on(Commands.SAVE_ALARM_ADVICE_COMMAND, CommandHandlers.handleSaveAlarmAdviceCommand);
CommandBus.on(Commands.SEND_ALARM_NOTIFICATION_COMMAND, CommandHandlers.handleSendAlarmNotificationCommand);
CommandBus.on(Commands.REQUEST_WEEKLY_REVIEW_COMMAND, CommandHandlers.handleRequestWeeklyReviewCommand);
CommandBus.on(Commands.COMPLETE_WEEKLY_REVIEW_COMMAND, CommandHandlers.handleCompleteWeeklyReviewCommand);
CommandBus.on(
  Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
  CommandHandlers.handleMarkWeeklyReviewAsFailedCommand,
);
