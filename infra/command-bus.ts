import * as bg from "@bgord/bun";
import Emittery from "emittery";
import * as EmotionCommands from "+emotions/commands";
import { logger } from "+infra/logger";
import * as PublishngCommands from "+publishing/commands";

type AcceptedCommand =
  | EmotionCommands.CancelAlarmCommandType
  | EmotionCommands.DeleteEntryCommandType
  | EmotionCommands.EvaluateReactionCommandType
  | EmotionCommands.GenerateAlarmCommandType
  | EmotionCommands.LogEntryCommandType
  | EmotionCommands.ReappraiseEmotionCommandType
  | EmotionCommands.SaveAlarmAdviceCommandType
  | EmotionCommands.SendAlarmNotificationCommandType
  | EmotionCommands.RequestWeeklyReviewCommandType
  | EmotionCommands.CompleteWeeklyReviewCommandType
  | EmotionCommands.MarkWeeklyReviewAsFailedCommandType
  | EmotionCommands.DetectWeeklyPatternsCommandType
  | EmotionCommands.ExportWeeklyReviewByEmailCommand
  | EmotionCommands.ScheduleTimeCapsuleEntryCommandType
  | PublishngCommands.CreateShareableLinkCommandType
  | PublishngCommands.ExpireShareableLinkCommandType
  | PublishngCommands.RevokeShareableLinkCommandType;

const CommandLogger = new bg.CommandLogger(logger);

export const CommandBus = new Emittery<bg.ToEventMap<AcceptedCommand>>({
  debug: { enabled: true, name: "infra/logger", logger: CommandLogger.handle },
});
