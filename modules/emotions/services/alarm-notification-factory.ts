import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";

export class AlarmNotificationFactory {
  static async create(
    detection: Emotions.VO.AlarmDetection,
    advice: AI.Advice,
  ): Promise<tools.NotificationTemplate> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await Emotions.Repos.EntryRepository.getById(detection.trigger.entryId);
        const composer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(entry);

        return composer.compose(advice);
      }

      case Emotions.VO.AlarmTriggerEnum.inactivity: {
        const composer = new Emotions.Services.InactivityAlarmAdviceNotificationComposer(detection.trigger);

        return composer.compose(advice);
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
