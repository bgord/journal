import type * as tools from "@bgord/tools";
import type * as AI from "+ai";
import * as Emotions from "+emotions";

export class AlarmNotificationFactory {
  constructor(private readonly entrySnapshot: Emotions.Ports.EntrySnapshotPort) {}

  async create(
    detection: Emotions.VO.AlarmDetection,
    advice: AI.Advice,
  ): Promise<tools.NotificationTemplate> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);
        const composer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
          entry as Emotions.VO.EntrySnapshot,
        );

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
