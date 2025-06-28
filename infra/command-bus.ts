import * as bg from "@bgord/bun";
import Emittery from "emittery";
import * as Commands from "../modules/emotions/commands";
import { logger } from "./logger";

type AcceptedCommand =
  | Commands.CancelAlarmCommandType
  | Commands.DeleteEmotionJournalEntryCommandType
  | Commands.EvaluateReactionCommandType
  | Commands.GenerateAlarmCommandType
  | Commands.LogEmotionCommandType
  | Commands.LogReactionCommandType
  | Commands.LogSituationCommandType
  | Commands.ReappraiseEmotionCommandType
  | Commands.SaveAlarmAdviceCommandType
  | Commands.SendAlarmNotificationCommandType
  | Commands.RequestWeeklyReviewCommandType;

const CommandLogger = new bg.CommandLogger(logger);

export const CommandBus = new Emittery<bg.ToEventMap<AcceptedCommand>>({
  debug: { enabled: true, name: "infra/logger", logger: CommandLogger.handle },
});
