import * as bg from "@bgord/bun";
import Emittery from "emittery";
import type * as EmotionCommands from "+emotions/commands";
import { logger } from "+infra/logger";
import type * as PublishingCommands from "+publishing/commands";

type AcceptedCommand =
  | EmotionCommands.CancelAlarmCommandType
  | EmotionCommands.DeleteEntryCommandType
  | EmotionCommands.EvaluateReactionCommandType
  | EmotionCommands.GenerateAlarmCommandType
  | EmotionCommands.LogEntryCommandType
  | EmotionCommands.ReappraiseEmotionCommandType
  | EmotionCommands.SaveAlarmAdviceCommandType
  | EmotionCommands.RequestAlarmNotificationCommandType
  | EmotionCommands.CompleteAlarmCommandType
  | EmotionCommands.RequestWeeklyReviewCommandType
  | EmotionCommands.CompleteWeeklyReviewCommandType
  | EmotionCommands.MarkWeeklyReviewAsFailedCommandType
  | EmotionCommands.DetectWeeklyPatternsCommandType
  | EmotionCommands.ExportWeeklyReviewByEmailCommandType
  | EmotionCommands.ScheduleTimeCapsuleEntryCommandType
  | PublishingCommands.CreateShareableLinkCommandType
  | PublishingCommands.ExpireShareableLinkCommandType
  | PublishingCommands.RevokeShareableLinkCommandType
  | bg.Preferences.Commands.SetUserLanguageCommandType;

const CommandLogger = new bg.CommandLogger(logger);

export const CommandBus = new Emittery<bg.ToEventMap<AcceptedCommand>>({
  debug: { enabled: true, name: "infra/logger", logger: CommandLogger.handle },
});
