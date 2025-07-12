import * as Commands from "+emotions/commands";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import Emittery from "emittery";

type AcceptedCommand =
  | Commands.CancelAlarmCommandType
  | Commands.DeleteEntryCommandType
  | Commands.EvaluateReactionCommandType
  | Commands.GenerateAlarmCommandType
  | Commands.LogEntryCommandType
  | Commands.ReappraiseEmotionCommandType
  | Commands.SaveAlarmAdviceCommandType
  | Commands.SendAlarmNotificationCommandType
  | Commands.RequestWeeklyReviewCommandType
  | Commands.CompleteWeeklyReviewCommandType
  | Commands.MarkWeeklyReviewAsFailedCommandType;

const CommandLogger = new bg.CommandLogger(logger);

export const CommandBus = new Emittery<bg.ToEventMap<AcceptedCommand>>({
  debug: { enabled: true, name: "infra/logger", logger: CommandLogger.handle },
});
