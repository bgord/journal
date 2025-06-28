import * as CommandHandlers from "../modules/emotions/command-handlers";
import * as Commands from "../modules/emotions/commands";
import { CommandBus } from "./command-bus";

CommandBus.on(Commands.CANCEL_ALARM_COMMAND, CommandHandlers.handleCancelAlarmCommand);
CommandBus.on(
  Commands.DELETE_EMOTION_JOURNAL_ENTRY_COMMAND,
  CommandHandlers.handleDeleteEmotionJournalEntryCommand,
);
CommandBus.on(Commands.EVALUATE_REACTION_COMMAND, CommandHandlers.handleEvaluateReactionCommand);
CommandBus.on(Commands.GENERATE_ALARM_COMMAND, CommandHandlers.handleGenerateAlarmCommand);
CommandBus.on(Commands.LOG_EMOTION_COMMAND, CommandHandlers.handleLogEmotionCommand);
CommandBus.on(Commands.LOG_REACTION_COMMAND, CommandHandlers.handleLogReactionCommand);
CommandBus.on(Commands.LOG_SITUATION_COMMAND, CommandHandlers.handleLogSituationCommand);
CommandBus.on(Commands.REAPPRAISE_EMOTION_COMMAND, CommandHandlers.handleReappraiseEmotionCommand);
CommandBus.on(Commands.SAVE_ALARM_ADVICE_COMMAND, CommandHandlers.handleSaveAlarmAdviceCommand);
CommandBus.on(Commands.SEND_ALARM_NOTIFICATION_COMMAND, CommandHandlers.handleSendAlarmNotificationCommand);
CommandBus.on(Commands.REQUEST_WEEKLY_REVIEW_COMMAND, CommandHandlers.handleRequestWeeklyReviewCommand);
