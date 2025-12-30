import type * as tools from "@bgord/tools";
import type * as AI from "+ai";
import * as Emotions from "+emotions";
import type { SupportedLanguages } from "+languages";

const AlarmNotificationFactoryError = {
  UnknownTrigger: "alarm.notification.factory.error.unknown.trigger",
};

export class AlarmNotificationFactory {
  constructor(
    private readonly entrySnapshot: Emotions.Ports.EntrySnapshotPort,
    private readonly language: SupportedLanguages,
  ) {}

  async create(
    detection: Emotions.VO.AlarmDetection,
    advice: AI.Advice,
  ): Promise<tools.NotificationTemplate | null> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);

        if (!entry) return null;

        const composer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(entry, this.language);

        return composer.compose(advice);
      }

      case Emotions.VO.AlarmTriggerEnum.inactivity: {
        const composer = new Emotions.Services.InactivityAlarmAdviceNotificationComposer(
          detection.trigger,
          this.language,
        );

        return composer.compose(advice);
      }

      default:
        throw new Error(AlarmNotificationFactoryError.UnknownTrigger);
    }
  }
}
