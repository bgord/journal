import * as bg from "@bgord/bun";
import * as CommandHandlers from "../modules/emotions/command-handlers";
import * as Commands from "../modules/emotions/commands";
import { CommandBus } from "./command-bus";
import { logger } from "./logger";

const CommandHandler = new bg.CommandHandler(logger);

CommandBus.on(Commands.CANCEL_ALARM_COMMAND, CommandHandler.handle(CommandHandlers.handleCancelAlarmCommand));
CommandBus.on(
  Commands.DELETE_EMOTION_JOURNAL_ENTRY_COMMAND,
  CommandHandler.handle(CommandHandlers.handleDeleteEmotionJournalEntryCommand),
);
CommandBus.on(
  Commands.EVALUATE_REACTION_COMMAND,
  CommandHandler.handle(CommandHandlers.handleEvaluateReactionCommand),
);
CommandBus.on(
  Commands.GENERATE_ALARM_COMMAND,
  CommandHandler.handle(CommandHandlers.handleGenerateAlarmCommand),
);
CommandBus.on(Commands.LOG_EMOTION_COMMAND, CommandHandler.handle(CommandHandlers.handleLogEmotionCommand));
CommandBus.on(Commands.LOG_REACTION_COMMAND, CommandHandler.handle(CommandHandlers.handleLogReactionCommand));
CommandBus.on(
  Commands.LOG_SITUATION_COMMAND,
  CommandHandler.handle(CommandHandlers.handleLogSituationCommand),
);
CommandBus.on(
  Commands.REAPPRAISE_EMOTION_COMMAND,
  CommandHandler.handle(CommandHandlers.handleReappraiseEmotionCommand),
);
CommandBus.on(
  Commands.SAVE_ALARM_ADVICE_COMMAND,
  CommandHandler.handle(CommandHandlers.handleSaveAlarmAdviceCommand),
);
CommandBus.on(
  Commands.SEND_ALARM_NOTIFICATION_COMMAND,
  CommandHandler.handle(CommandHandlers.handleSendAlarmNotificationCommand),
);
