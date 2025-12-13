import * as bg from "@bgord/bun";
import Emittery from "emittery";
import type * as EmotionCommands from "+emotions/commands";
import type * as PreferencesCommands from "+preferences/commands";
import type * as PublishingCommands from "+publishing/commands";

type Dependencies = { Logger: bg.LoggerPort };

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
  | bg.Preferences.Commands.SetUserLanguageCommandType
  | PreferencesCommands.UpdateProfileAvatarCommandType
  | PreferencesCommands.RemoveProfileAvatarCommandType;

export function createCommandBus(deps: Dependencies) {
  const CommandLogger = new bg.CommandLogger(deps);

  return new Emittery<bg.ToEventMap<AcceptedCommand>>({
    debug: { enabled: true, name: "infra/logger", logger: CommandLogger.handle },
  });
}
