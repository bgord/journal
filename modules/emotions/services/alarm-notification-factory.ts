import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import type * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";
import { EntryAlarmAdviceNotificationComposer } from "../services/entry-alarm-advice-notification-composer";
import { InactivityAlarmAdviceNotificationComposer } from "../services/inactivity-alarm-advice-notification-composer";
import { AlarmTriggerEnum } from "../value-objects/alarm-trigger";

const AlarmNotificationFactoryError = {
  UnknownTrigger: "alarm.notification.factory.error.unknown.trigger",
};

export class AlarmNotificationFactory {
  constructor(
    private readonly entrySnapshot: Emotions.Ports.EntrySnapshotPort,
    private readonly language: LanguagesType,
  ) {}

  async create(
    detection: Emotions.VO.AlarmDetection,
    advice: AI.Advice,
  ): Promise<bg.MailerTemplateMessage | null> {
    switch (detection.trigger.type) {
      case AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);

        if (!entry) return null;

        const composer = new EntryAlarmAdviceNotificationComposer(entry, this.language);

        return composer.compose(advice);
      }

      case AlarmTriggerEnum.inactivity: {
        const composer = new InactivityAlarmAdviceNotificationComposer(detection.trigger, this.language);

        return composer.compose(advice);
      }

      default:
        throw new Error(AlarmNotificationFactoryError.UnknownTrigger);
    }
  }
}
